import type { Parent, Root } from 'mdast';
import type { Plugin } from 'unified';
import { SKIP, visit } from 'unist-util-visit';

export const remarkExtractTitle: Plugin<[], Root> = () => {
  return (tree: Root) => {
    let title = '';
    let titleParent: Parent | undefined;

    visit(tree, 'heading', (node, _index, parent) => {
      if (node.depth === 1 && !title) {
        title = node.children
          .map((child: any) => child.value || '')
          .join('')
          .trim()

        titleParent = parent;
        return [SKIP];  // Signal visit correctly [web:9]
      }
    });

    if (title && titleParent) {
      // Inject ESM export as first node
      tree.children.unshift({
        "type": "mdxjsEsm",
        "value": "",
        "data": {
          "estree": {
            "type": "Program",
            "sourceType": "module",
            "body": [
              {
                "type": "ExportNamedDeclaration",
                "declaration": {
                  "type": "VariableDeclaration",
                  "kind": "const",
                  "declarations": [
                    {
                      "type": "VariableDeclarator",
                      "id": {
                        "type": "Identifier",
                        "name": "title"
                      },
                      "init": {
                        "type": "Literal",
                        "value": title || '',
                      }
                    }
                  ]
                },
                "attributes": [],
                "specifiers": []
              }
            ]
          }
        }
      })

      // Remove the original title heading
      titleParent.children = titleParent.children.filter((node) => {
        if (node.type === 'heading' && node.depth === 1) {
          return false;
        }
        return true;
      });
    }
  };
};
