// add a uid for pages and folders id ? will avoid problems if duplicates

var treeDoc = new Tree(document.getElementById('tree'), {
  navigate: true // allow navigate with ArrowUp and ArrowDown
});

const tree = [];

for (let path in dataJSON) {
  const content = dataJSON[path];
  const pageTitle = content.title;
  const crumb = path.split("/");
  // ['', 'folder1','folder2', ... , pageId ]
  let pageId = crumb.pop();
  if (pageId == '') pageId = '_ROOT_';
  let parentFolderId = crumb.slice(-1)[0];
  if (parentFolderId == '' && pageId == '_ROOT_') parentFolderId = 'SUPER-ROOT';
  if (parentFolderId == '') parentFolderId = 'ROOT';
  parentFolderId = '_' + parentFolderId + '_'; // added to distinguished from pageId

  tree.push({
    id: pageId,
    parentId: parentFolderId,
    name: pageTitle,
    type: 'page'
  })

  crumb.forEach((folderId, level) => {
    let parentId = crumb[level - 1];
    if (parentId == '') {
      parentId = '_ROOT_'
    } else {
      parentId = '_' + parentId + '_';
    }
    const push = {
      id: '_' + folderId + '_',
      parentId: parentId,
      name: folderId.replace('-', ' '),
      // type: 'folder',
      type : Tree.FOLDER,
      level: level
    }
    if (folderId != '' && !tree.some(el => JSON.stringify(el) === JSON.stringify(push)))
      tree.push(push);
  });
}

// build the hierarchial JSON 
// from https://typeofnan.dev/an-easy-way-to-build-a-tree-with-object-references/
let root;

const idMapping = tree.reduce((acc, el, i) => {
  acc[el.id] = i;
  return acc;
}, {});

tree.forEach((el) => {
  // Handle the root element
  if (el.parentId == '_SUPER-ROOT_') {
    root = el;
    return;
  }
  // Use our mapping to locate the parent element in our data array
  const parentEl = tree[idMapping[el.parentId]];
  // Add our current el to its parent's `children` array
  parentEl.children = [...(parentEl.children || []), el];
});

// display tree structure 
// from https://www.cssscript.com/folder-tree-json/

const structure = root.children

treeDoc.json(structure);


