import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export const remarkPrefixImages: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'image', (node) => {
      if (node.url) {
        // node.url = `@@/content/media/${node.url}`
        node.url = `/api/images/${node.url}`
        console.log('node.url', node.url)
        return false;
      }
    })
  }
}
