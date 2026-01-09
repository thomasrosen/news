import type { Root } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

export const remarkExtractTitle: Plugin<[], Root> = () => {
  return (tree: Root) => {
    let title = '';

    visit(tree, 'heading', (node) => {
      if (node.depth === 1 && !title) {
        title = node.children
          .map((child: any) => child.value || '')
          .join('')
          .trim()
        return false;
      }
    });

    if (title) {
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
    }
  };
};
