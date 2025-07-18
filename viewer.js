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
        "Social Work Research- Meaning, Steps and its relevance to social work practice.md"
      ],
      "Unit 2": [
        "Hypothesis-Meaning, Characteristics, Source and types.md", 
        "Sampling Techniques.md",
        "Sampling- Meaning, types and utility, reliability of sample, general considerations in the determination of sample size.md"
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
    semLi.classList.add('list-group-item', 'tree-item');
    semLi.textContent = semester;

    const subjUl = document.createElement('ul');
    subjUl.classList.add('list-group', 'nested');
    for (let subject in structure[semester]) {
      const subjLi = document.createElement('li');
      subjLi.classList.add('list-group-item', 'tree-item');
      subjLi.textContent = subject;

      const unitUl = document.createElement('ul');
      unitUl.classList.add('list-group', 'nested');
      for (let unit in structure[semester][subject]) {
        const unitLi = document.createElement('li');
        unitLi.classList.add('list-group-item', 'tree-item');
        unitLi.textContent = unit;

        const topicUl = document.createElement('ul');
        topicUl.classList.add('list-group', 'nested');
        structure[semester][subject][unit].forEach(topic => {
          const topicLi = document.createElement('li');
          topicLi.classList.add('list-group-item', 'tree-item', 'clickable');
          topicLi.textContent = topic.replace('.md', '');
          topicLi.onclick = () => {
            // Highlight the selected item
            document.querySelectorAll('.active-item').forEach(el => {
              el.classList.remove('active-item');
            });
            topicLi.classList.add('active-item');
            
            const path = `notes/${semester}/${subject}/${unit}/${topic}`;
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

  // Add click handlers to expand/collapse tree items
  document.querySelectorAll('.tree-item').forEach(item => {
    if (item.querySelector('ul.nested')) {
      item.classList.add('expandable');
      item.addEventListener('click', function(e) {
        if (e.target === this) {
          this.classList.toggle('expanded');
          const nestedList = this.querySelector('ul.nested');
          if (nestedList) {
            nestedList.classList.toggle('active');
          }
          e.stopPropagation();
        }
      });
    }
  });
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
