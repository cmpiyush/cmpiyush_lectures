// Define your structure manually or fetch from repo API
const structure = {
  "Semester 1": {
    "MSW 101": {
      "Unit 1": ["Concept of Social Work.md", "Values of Social Work.md"],
      "Unit 2": ["History of Social Work.md"]
    },
    "MSW 102": {
      "Unit 1": ["Introduction to Psychology.md"]
    },
    "MSW 103": {
      "Unit 1": [
        "Social Research- Meaning and purpose.md", 
        "Types of research-Pure, Applied, Basic, Action.md",
        "Social Work Research- Meaning, Steps and its relevance to social work practice"
      ],
      "Unit 2": [
        "Hypothesis-Meaning, Characteristics, Source and types", "Sampling Techniques.md",
        "Sampling- Meaning, types and utility, reliability of sample, general considerations in the determination of sample size.md",
      ]
    }
  },
  "Semester 2": {
    "MSW 201": {
      "Unit 1": ["Community Organization.md"]
    }
  }
};

const navTree = document.getElementById('nav-tree');
const noteDisplay = document.getElementById('note-display');

function createTree() {
  for (let semester in structure) {
    const semLi = document.createElement('li');
    semLi.textContent = semester;

    const subjUl = document.createElement('ul');
    for (let subject in structure[semester]) {
      const subjLi = document.createElement('li');
      subjLi.textContent = subject;

      const unitUl = document.createElement('ul');
      for (let unit in structure[semester][subject]) {
        const unitLi = document.createElement('li');
        unitLi.textContent = unit;

        const topicUl = document.createElement('ul');
        structure[semester][subject][unit].forEach(topic => {
          const topicLi = document.createElement('li');
          topicLi.textContent = topic.replace('.md', '');
          topicLi.onclick = () => {
            const path = `${semester}/${subject}/${unit}/${topic}`;
            loadNote(path);
          };
          topicUl.appendChild(topicLi);
        });

        unitLi.appendChild(topicUl);
        unitUl.appendChild(unitLi);
      }

      subjLi.appendChild(unitUl);
      subjUl.appendChild(subjLi);
    }

    semLi.appendChild(subjUl);
    navTree.appendChild(semLi);
  }
}

async function loadNote(filePath) {
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error('Note not found');
    const md = await res.text();
    noteDisplay.innerHTML = marked.parse(md);
  } catch (err) {
    noteDisplay.innerHTML = `<p style="color:red;">Failed to load note: ${filePath}</p>`;
  }
}

createTree();
