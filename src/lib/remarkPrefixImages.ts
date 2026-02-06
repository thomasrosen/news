import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const remarkPrefixImages: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'image', (node) => {
      if (node.url) {
        node.url = `/api/storage/images/${node.url}`
          .replace(/\/{2,}/g, '/') // replace multiple slashes with a single slash
        return false;
      }
    })
  }
}
