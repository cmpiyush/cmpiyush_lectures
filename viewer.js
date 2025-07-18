// Define your structure manually or fetch from repo API
const structure = {
  "Semester 1": {
    "MSW 101": {
      "Unit-1": [
        "Goals and Functions of Social Work.md", 
        "Principles, values and philosophy of  Social Work.md",
        "System and Integrated Approach to  Social Work Practice.md",
        "The Concept of Social Work.md"
      ],
      "Unit 2": [
        "History of Social Work.md"
      ]
    },
    "MSW 102": {
      "Unit 1": [
        "Introduction to Psychology.md"
      ]
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
  },
  "Semester 3": {
    "MSW 301": {
      "Unit 1": ["Example Note 1.md"]
    }
  },
  "Semester 4": {
    "MSW 401": {
      "Unit 1": ["Example Note 1.md"]
    }
  }
};

let currentSemester = "Semester 1";

const navTree = document.getElementById('nav-tree');
const noteDisplay = document.getElementById('note-display');

function createTree() {
  // Clear the navigation tree first
  navTree.innerHTML = '';
  
  // Update the current semester display
  document.getElementById('current-semester').textContent = currentSemester;
  
  // Only show subjects for the current semester
  for (let subject in structure[currentSemester]) {
    const subjLi = document.createElement('li');
    subjLi.classList.add('list-group-item', 'tree-item');
    subjLi.textContent = subject;

    const unitUl = document.createElement('ul');
    unitUl.classList.add('list-group', 'nested');
    for (let unit in structure[currentSemester][subject]) {
      const unitLi = document.createElement('li');
      unitLi.classList.add('list-group-item', 'tree-item');
      unitLi.textContent = unit;

      const topicUl = document.createElement('ul');
      topicUl.classList.add('list-group', 'nested');
      structure[currentSemester][subject][unit].forEach(topic => {
        const topicLi = document.createElement('li');
        topicLi.classList.add('list-group-item', 'tree-item', 'clickable');
        topicLi.textContent = topic.replace('.md', '');
        topicLi.onclick = () => {
          // Highlight the selected item
          document.querySelectorAll('.active-item').forEach(el => {
            el.classList.remove('active-item');
          });
          topicLi.classList.add('active-item');
          
          const path = `${currentSemester}/${subject}/${unit}/${topic}`;
          loadNote(path);
        };
        topicUl.appendChild(topicLi);
      });

      unitLi.appendChild(topicUl);
      unitUl.appendChild(unitLi);
    }

    subjLi.appendChild(unitUl);
    navTree.appendChild(subjLi);
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

// Function to change the current semester
function changeSemester(semester) {
  if (structure[semester]) {
    currentSemester = semester;
    createTree();
    // Clear the note display
    noteDisplay.innerHTML = '<p>Select a note to view it here.</p>';
  }
}

// Add event listeners to semester links
document.addEventListener('DOMContentLoaded', function() {
  const semesterLinks = document.querySelectorAll('.nav-link[data-semester]');
  semesterLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const semester = this.getAttribute('data-semester');
      changeSemester(semester);
      
      // Update active state in navbar
      semesterLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Set the first semester as active by default
  semesterLinks[0].classList.add('active');
  
  // Initialize the tree
  createTree();
});
