// import { handleSupabaseError } from "@cloudy/utils/common";
import { Node, mergeAttributes } from "@tiptap/core";
import { DOMOutputSpec, Node as ProseMirrorNode } from "@tiptap/pm/model";
import { PluginKey } from "@tiptap/pm/state";
import { Editor, ReactRenderer } from "@tiptap/react";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import tippy, { Instance } from "tippy.js";

// import { supabase } from "src/clients/supabase";
import { makeThoughtLabel } from "@/utils/thought";
import { getAllNodesWithType, updateNodeAttributes } from "@/utils/tiptap";

import { MentionHandler } from "./MentionHandler";

export const mention = {
	render: () => {
		let reactRenderer: ReactRenderer;
		let popup: Instance<any>[];

		return {
			onStart: (props: any) => {
				if (!props.clientRect) {
					return;
				}

				reactRenderer = new ReactRenderer(MentionHandler, {
					props,
					editor: props.editor,
				});

				popup = tippy("body", {
					getReferenceClientRect: props.clientRect,
					appendTo: () => document.body,
					content: reactRenderer.element,
					showOnCreate: true,
					interactive: true,
					trigger: "manual",
					placement: "bottom-start",
				});
			},

			onUpdate(props: any) {
				reactRenderer.updateProps(props);

				if (!props.clientRect) {
					return;
				}

				popup[0].setProps({
					getReferenceClientRect: props.clientRect,
				});
			},

			onKeyDown(props: any) {
				const hide = () => {
					popup[0].hide();
				};

				// @ts-ignore
				return reactRenderer.ref?.onKeyDown({
					...props,
					hide,
				});
			},

			onExit() {
				popup[0].destroy();
				reactRenderer.destroy();
			},
		};
	},
};

// See `addAttributes` below
export interface MentionNodeAttrs {
	/**
	 * The identifier for the selected item that was mentioned, stored as a `data-id`
	 * attribute.
	 */
	id: string | null;
	/**
	 * The label to be rendered by the editor as the displayed text for this mentioned
	 * item, if provided. Stored as a `data-label` attribute. See `renderLabel`.
	 */
	label?: string | null;
}

export type MentionOptions<SuggestionItem = any, Attrs extends Record<string, any> = MentionNodeAttrs> = {
	/**
	 * The HTML attributes for a mention node.
	 * @default {}
	 * @example { class: 'foo' }
	 */
	HTMLAttributes: Record<string, any>;

	/**
	 * A function to render the label of a mention.
	 * @deprecated use renderText and renderHTML instead
	 * @param props The render props
	 * @returns The label
	 * @example ({ options, node }) => `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
	 */
	renderLabel?: (props: { options: MentionOptions<SuggestionItem, Attrs>; node: ProseMirrorNode }) => string;

	/**
	 * A function to render the text of a mention.
	 * @param props The render props
	 * @returns The text
	 * @example ({ options, node }) => `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
	 */
	renderText: (props: { options: MentionOptions<SuggestionItem, Attrs>; node: ProseMirrorNode }) => string;

	/**
	 * A function to render the HTML of a mention.
	 * @param props The render props
	 * @returns The HTML as a ProseMirror DOM Output Spec
	 * @example ({ options, node }) => ['span', { 'data-type': 'mention' }, `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`]
	 */
	renderHTML: (props: { options: MentionOptions<SuggestionItem, Attrs>; node: ProseMirrorNode }) => DOMOutputSpec;

	/**
	 * Whether to delete the trigger character with backspace.
	 * @default false
	 */
	deleteTriggerWithBackspace: boolean;

	/**
	 * The suggestion options.
	 * @default {}
	 * @example { char: '@', pluginKey: MentionPluginKey, command: ({ editor, range, props }) => { ... } }
	 */
	suggestion: Omit<SuggestionOptions<SuggestionItem, Attrs>, "editor">;
};

/**
 * The plugin key for the mention plugin.
 * @default 'mention'
 */
export const MentionPluginKey = new PluginKey("mention");

const getHrefFromNode = (node: ProseMirrorNode) => {
	return `/thoughts/${node.attrs.id}`;
};

/**
 * This extension allows you to insert mentions into the editor.
 * @see https://www.tiptap.dev/api/extensions/mention
 */
export const Mention = Node.create<MentionOptions>({
	name: "mention",

	addOptions() {
		return {
			HTMLAttributes: {},
			renderText({ options, node }) {
				return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
			},
			deleteTriggerWithBackspace: false,
			renderHTML({ options, node }) {
				return [
					"a",
					mergeAttributes(
						{ class: "mention", href: getHrefFromNode(node) },
						this.HTMLAttributes,
						options.HTMLAttributes,
					),
					`${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
				];
			},
			suggestion: {
				char: "@",
				pluginKey: MentionPluginKey,
				command: ({ editor, range, props }) => {
					// increase range.to by one when the next node is of type "text"
					// and starts with a space character
					const nodeAfter = editor.view.state.selection.$to.nodeAfter;
					const overrideSpace = nodeAfter?.text?.startsWith(" ");

					if (overrideSpace) {
						range.to += 1;
					}

					editor
						.chain()
						.focus()
						.insertContentAt(range, [
							{
								type: this.name,
								attrs: props,
							},
							{
								type: "text",
								text: " ",
							},
						])
						.run();

					window.getSelection()?.collapseToEnd();
				},
				allow: ({ state, range }) => {
					const $from = state.doc.resolve(range.from);
					const type = state.schema.nodes[this.name];
					const allow = !!$from.parent.type.contentMatch.matchType(type);

					return allow;
				},
			},
		};
	},

	group: "inline",

	inline: true,

	selectable: false,

	atom: true,

	addAttributes() {
		return {
			id: {
				default: null,
				parseHTML: element => element.getAttribute("data-id"),
				renderHTML: attributes => {
					if (!attributes.id) {
						return {};
					}

					return {
						"data-id": attributes.id,
					};
				},
			},

			label: {
				default: null,
				parseHTML: element => element.getAttribute("data-label"),
				renderHTML: attributes => {
					if (!attributes.label) {
						return {};
					}

					return {
						"data-label": attributes.label,
					};
				},
			},
		};
	},

	addStorage() {
		return {
			markdown: {
				serialize: (state: any, node: any) => {
					state.write(`[@${node.attrs.label ?? node.attrs.id}](${getHrefFromNode(node)})`);
				},
				parse: {
					// We don't parse from markdown.
				},
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: `a[data-type="${this.name}"]`,
			},
		];
	},

	renderHTML({ node, HTMLAttributes }) {
		if (this.options.renderLabel !== undefined) {
			console.warn("renderLabel is deprecated use renderText and renderHTML instead");
			return [
				"a",
				mergeAttributes({ "data-type": this.name }, this.options.HTMLAttributes, HTMLAttributes),
				this.options.renderLabel({
					options: this.options,
					node,
				}),
			];
		}
		const mergedOptions = { ...this.options };

		mergedOptions.HTMLAttributes = mergeAttributes({ "data-type": this.name }, this.options.HTMLAttributes, HTMLAttributes);
		const html = this.options.renderHTML({
			options: mergedOptions,
			node,
		});

		if (typeof html === "string") {
			return ["a", mergeAttributes({ "data-type": this.name }, this.options.HTMLAttributes, HTMLAttributes), html];
		}
		return html;
	},

	renderText({ node }) {
		if (this.options.renderLabel !== undefined) {
			console.warn("renderLabel is deprecated use renderText and renderHTML instead");
			return this.options.renderLabel({
				options: this.options,
				node,
			});
		}
		return this.options.renderText({
			options: this.options,
			node,
		});
	},

	addKeyboardShortcuts() {
		return {
			Backspace: () =>
				this.editor.commands.command(({ tr, state }) => {
					let isMention = false;
					const { selection } = state;
					const { empty, anchor } = selection;

					if (!empty) {
						return false;
					}

					state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
						if (node.type.name === this.name) {
							isMention = true;
							tr.insertText(
								this.options.deleteTriggerWithBackspace ? "" : this.options.suggestion.char || "",
								pos,
								pos + node.nodeSize,
							);

							return false;
						}
					});

					return isMention;
				}),
		};
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion,
			}),
		];
	},
});

export const updateMentionNodeNames = async (editor: Editor) => {
	const mentions = getAllNodesWithType(editor, "mention");

	// const potentialThoughtLabels = handleSupabaseError(
	// 	await supabase
	// 		.from("thoughts")
	// 		.select("id, title, content_plaintext, content_md")
	// 		.in(
	// 			"id",
	// 			mentions.map(mention => mention.id),
	// 		),
	// );

	interface Thought {
		id: string;
		title: string;
		content_plaintext: string;
		content_md: string;
	}

	interface LabelId {
		id: string;
		label: string;
	}

	// const labelIdList: LabelId[] = (potentialThoughtLabels as Thought[]).map((thought: Thought) => ({
	// 	id: thought.id,
	// 	label: makeThoughtLabel(thought),
	// }));

	// mentions.forEach(mention => {
	// 	const label = labelIdList.find(label => label.id === mention.id)?.label;
	// 	if (label && mention.label !== label) {
	// 		updateNodeAttributes(editor, mention.pos, { label });
	// 	}
	// });
};
