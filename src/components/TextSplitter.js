export class TextSplitter {
  constructor(target, options = {}) {
    this.chars = [];
    this.words = [];
    this.lines = [];
    this.elements = [];
    this.originalHTML = new Map();

    const type = options.type || "chars,words,lines";
    const linesClass = options.linesClass || "split-line";

    let elements = [];
    if (typeof target === "string") {
      elements = Array.from(document.querySelectorAll(target));
    } else if (target instanceof NodeList) {
      elements = Array.from(target);
    } else if (Array.isArray(target)) {
      elements = target;
    } else if (target) {
      elements = [target];
    }

    this.elements = elements;

    elements.forEach((el) => {
      this.originalHTML.set(el, el.innerHTML);

      if (type.includes("chars") && type.includes("words")) {
        this.splitWords(el);
        this.splitCharsFromWords(el);
      } else if (type.includes("chars")) {
        this.splitChars(el);
      } else if (type.includes("words")) {
        this.splitWords(el);
      }

      if (type.includes("lines")) {
        this.splitLines(el, linesClass);
      }
    });
  }

  splitChars(el) {
    const chars = (el.textContent || "").split("");
    el.innerHTML = chars
      .map((c) =>
        c === " "
          ? '<span class="split-char"> </span>'
          : c === "\n"
          ? "<br>"
          : `<span class="split-char">${c}</span>`
      )
      .join("");
    this.chars.push(...Array.from(el.querySelectorAll(".split-char")));
  }

  splitWords(el) {
    const words = (el.textContent || "").split(/(\s+)/);
    el.innerHTML = words
      .map((w) =>
        w.trim().length === 0
          ? w
          : `<span class="split-word">${w}</span>`
      )
      .join("");
    this.words.push(...Array.from(el.querySelectorAll(".split-word")));
  }

  splitCharsFromWords(el) {
    el.querySelectorAll(".split-word").forEach((wordEl) => {
      const chars = (wordEl.textContent || "").split("");
      wordEl.innerHTML = chars
        .map((c) => `<span class="split-char">${c}</span>`)
        .join("");
      this.chars.push(...Array.from(wordEl.querySelectorAll(".split-char")));
    });
  }

  splitLines(el, linesClass) {
    requestAnimationFrame(() => {
      const children = el.querySelectorAll(".split-word, .split-char");
      if (children.length === 0) return;

      let lines = [];
      let currentLine = [];
      let lastTop = 0;

      children.forEach((child) => {
        const top = child.getBoundingClientRect().top;
        if (lastTop === 0) lastTop = top;

        if (Math.abs(top - lastTop) > 5) {
          if (currentLine.length > 0) lines.push([...currentLine]);
          currentLine = [child];
          lastTop = top;
        } else {
          currentLine.push(child);
        }
      });

      if (currentLine.length > 0) lines.push(currentLine);

      lines.forEach((line) => {
        if (line.length === 0) return;
        const span = document.createElement("span");
        span.className = linesClass;
        span.style.display = "block";
        const first = line[0];
        if (first.parentNode) {
          first.parentNode.insertBefore(span, first);
          line.forEach((item) => {
            span.appendChild(item);
          });
        }
      });

      this.lines.push(...Array.from(el.querySelectorAll(`.${linesClass}`)));
    });
  }

  revert() {
    this.elements.forEach((el) => {
      const original = this.originalHTML.get(el);
      if (original !== undefined) {
        el.innerHTML = original;
      }
    });
    this.chars = [];
    this.words = [];
    this.lines = [];
    this.originalHTML.clear();
  }
}
