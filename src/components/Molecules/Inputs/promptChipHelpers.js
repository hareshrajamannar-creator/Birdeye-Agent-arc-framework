/**
 * Shared DOM helpers for variable chips inside contentEditable prompt areas.
 * Classes (prompt-chip, prompt-chip-label, etc.) are defined globally in prompt-chip.css.
 */

export function serializeFrom(el) {
  if (!el) return '';
  let text = '';
  el.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      text += node.textContent;
    } else if (node.nodeName === 'BR') {
      text += '\n';
    } else if (node.nodeType === 1 && node.dataset.chip !== undefined) {
      text += `{{${node.dataset.chip}}}`;
    } else if (node.nodeType === 1) {
      text += serializeFrom(node);
    }
  });
  return text;
}

export function createViewChip(name, onDelete) {
  const chip = document.createElement('span');
  chip.contentEditable = 'false';
  chip.dataset.chip = name;
  chip.className = 'prompt-chip';

  const label = document.createElement('span');
  label.className = 'prompt-chip-label';
  label.textContent = name;
  chip.appendChild(label);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'prompt-chip-del';
  btn.onmousedown = (e) => e.preventDefault();
  btn.onclick = () => { chip.remove(); onDelete?.(); };
  const icon = document.createElement('span');
  icon.className = 'material-symbols-outlined';
  icon.textContent = 'close';
  btn.appendChild(icon);
  chip.appendChild(btn);

  return chip;
}

export function deserializeInto(el, value, onDelete) {
  el.innerHTML = '';
  if (!value) return;
  const parts = value.split(/({{[^}]+}})/);
  parts.forEach((part) => {
    const m = part.match(/^{{(.+)}}$/);
    if (m) {
      el.appendChild(createViewChip(m[1], onDelete));
    } else {
      const lines = part.split('\n');
      lines.forEach((line, i) => {
        if (line) el.appendChild(document.createTextNode(line));
        if (i < lines.length - 1) el.appendChild(document.createElement('br'));
      });
    }
  });
}

export function insertChipAt(el, range, onFinalize) {
  const chip = document.createElement('span');
  chip.contentEditable = 'false';
  chip.className = 'prompt-chip prompt-chip--editing';

  const input = document.createElement('input');
  input.className = 'prompt-chip-input';
  input.placeholder = 'variable';
  input.size = 8;

  const finalize = () => {
    const name = input.value.trim();
    chip.className = 'prompt-chip';
    chip.innerHTML = '';
    if (!name) {
      chip.remove();
    } else {
      chip.dataset.chip = name;
      const label = document.createElement('span');
      label.className = 'prompt-chip-label';
      label.textContent = name;
      chip.appendChild(label);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'prompt-chip-del';
      btn.onmousedown = (e) => e.preventDefault();
      btn.onclick = () => { chip.remove(); onFinalize(); };
      const icon = document.createElement('span');
      icon.className = 'material-symbols-outlined';
      icon.textContent = 'close';
      btn.appendChild(icon);
      chip.appendChild(btn);
    }
    onFinalize();
  };

  input.onkeydown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); finalize(); }
    if (e.key === 'Escape') { e.preventDefault(); chip.remove(); onFinalize(); }
  };
  input.onblur = finalize;
  chip.appendChild(input);

  if (range && el.contains(range.commonAncestorContainer)) {
    range.deleteContents();
    range.insertNode(chip);
    const newRange = document.createRange();
    newRange.setStartAfter(chip);
    newRange.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(newRange);
  } else {
    el.appendChild(chip);
  }
  input.focus();
}
