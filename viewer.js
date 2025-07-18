const navTree = document.getElementById('nav-tree');
const noteDisplay = document.getElementById('note-display');

// Define your structure manually or fetch from repo API
const structure = {
  "Sociology": {
    "Unit1": ["Note1.md", "Note2.md"],
    "Unit2": ["Note3.md"]
  },
  "Economics": {
    "Unit1": ["NoteA.md"]
  }
};

function createTree() {
  for (let subject in structure) {
    const subjectLi = document.createElement('li');
    subjectLi.textContent = subject;

    const unitUl = document.createElement('ul');
    for (let unit in structure[subject]) {
      const unitLi = document.createElement('li');
      unitLi.textContent = unit;

      const noteUl = document.createElement('ul');
      structure[subject][unit].forEach(note => {
        const noteLi = document.createElement('li');
        noteLi.textContent = note.replace('.md', '');
        noteLi.onclick = () => loadNote(subject, unit, note);
        noteUl.appendChild(noteLi);
      });

      unitLi.appendChild(noteUl);
      unitUl.appendChild(unitLi);
    }

    subjectLi.appendChild(unitUl);
    navTree.appendChild(subjectLi);
  }
}

async function loadNote(subject, unit, note) {
  const url = `Subjects/${subject}/${unit}/${note}`;
  try {
    const res = await fetch(url);
    const md = await res.text();
    noteDisplay.innerHTML = marked.parse(md);
  } catch (err) {
    noteDisplay.innerHTML = `<p>Error loading note: ${note}</p>`;
  }
}

createTree();
