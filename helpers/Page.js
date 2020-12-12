const { convertURL } = require("./functions");

class Page {
  constructor(name, filename, url) {
    this.name = name;
    this.filename = filename;
    this.url = url;
  }

  convertURL(url, swapOne, swapTwo) {
    url = url.split("");

    return url
      .map((char) => {
        if (char === swapOne) {
          char = swapTwo;
        }

        return char;
      })
      .join("");
  }

  createFilename() {
    let file = this.url.slice(8);
    file = file.endsWith("/") ? file.slice(0, -1) : file;
    this.filename = this.convertURL(file, "/", "_");
  }
}

module.exports = Page;
