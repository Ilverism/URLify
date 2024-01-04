// Adjusted regular expression to better detect URLs, including those starting with "http://"
const urlRegex = /\b((http:\/\/)?\w+DOT\w+(\DOT\w+)*)(\/\S*)?\b/g;

function convertDOTtoURLs(node) {
  if (node.nodeType === Node.TEXT_NODE && urlRegex.test(node.nodeValue)) {
    let fragments = node.nodeValue.split(urlRegex);
    
    for (let fragment of fragments) {
      if (urlRegex.test(fragment)) {
        let url = fragment.replace(/DOT/g, '.');
        let a = document.createElement('a');
        a.href = url.startsWith('http') ? url : 'http://' + url;
        //a.target = "_blank";
        //a.textContent = url;
        node.parentNode.insertBefore(a, node);
      } else {
        let text = document.createTextNode(fragment);
        node.parentNode.insertBefore(text, node);
      }
    }
    node.parentNode.removeChild(node);
  } else {
    node.childNodes.forEach(convertDOTtoURLs);
  }
}

// Mutation observer to monitor changes in the webpage
const observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(convertDOTtoURLs);
    }
  }
});

// Start observing the document
observer.observe(document, {
  childList: true,
  subtree: true
});

// Convert any 'DOT' text already in the document
convertDOTtoURLs(document.body);
