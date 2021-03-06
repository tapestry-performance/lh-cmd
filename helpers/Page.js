const date = require("date-and-time");

class Page {
  constructor(name, filename, url) {
    this.name = name;
    this.filename = filename;
    this.url = url;
    this.date = "";
    this.cls = false;
    this.stats = {};
  }

  convertURL(url, existingChar, newChar) {
    url = url.split("");

    return url
      .map((char) => {
        if (char === existingChar) {
          char = newChar;
        }

        return char;
      })
      .join("");
  }

  createFilename() {
    let file = this.url.slice(8);
    file = file.endsWith("/") ? file.slice(0, -1) : file;
    this.filename = this.convertURL(file, "/", "_");
    this.filename = this.filename.replace(/[<>:"/\|?*]/g, "");
  }

  createTimestamp() {
    const now = date.format(new Date(), "MM-DD-YYYY-HH-mm-ss");
    this.filename = `${this.filename}-${now}`;
    this.date = now;
  }

  saveStats(obj) {
    this.stats = obj;
  }
}

module.exports = Page;
