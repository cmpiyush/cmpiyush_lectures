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
        "History of Social Work.md",
        "Social work profession as a change agent.md",
        "Social Work in India- Historical Perspective.md",
        "Social service and reform tradition in India.md",
        "Hindu reforms movements.md"
      ],
      "Unit 3": [
        "Attributes of a profession.md",
        "Attributes of a professional social worker.md",
        "Role and functions of social work profession.md",
        "Professional Code of Ethics.md",
        " Challenges of Social Work as a Profession.md",
        " Interface between Professional and Voluntary Social Work.md"
      ],
      "Unit 4": [
        "Units of social work intervention and dynamics.md",
        "Individual and Family.md",
        "Group, organizations and communities.md",
      ],
      "Unit 5": [
        "Neo-liberalism and globalization.md",
        "Post modernism.md",
        "Feminism.md",
        "Resurgence of civil society.md",
        "Ideology of Non-Government organization.md"
      ]
    },
    "MSW 102": {
      "Unit 1": [
        "Society as a system of relationship, Social Structure and Social Processes.md",
      ],
      "Unit 2": [
        "Socialization- Meaning, process and significance.md",
        "Social Institutions- Meaning, characteristics and types.md",
        "Social Stratification- Meaning, characteristics and types.md"
      ],
      "Unit 3": [
        "Society and Culture.md",
        "Social Control- Meaning, concept and agencies, characteristics and types.md",
        "Social Problems- Meaning, characteristics and types.md"
      ],
      "Unit 4":[
        "Theories of Society.md",
        "Indian Society.md"
      ],
      "Unit 5": [
        "Social change.md",
        "Social change process in India"
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
      ],
      "Unit 3": [
        "Research Design - Meaning and Types",
        "Scaling method - Bogardus & Likert",
        "Tools of data collections",
        "Observation, interview and case study",
        "Sources of data: Primary and Secondary"
      ],
      "Unit 4": [
        "Statistics-Meaning, Signification, Uses and limitations",
        "Diagrammatic representation of data.md",
        "Measures of Central Tendencies- Mean, Median and Mode",
        "Measures of Dispersion- Range, Interquartile Range, Standard Deviation, Variance",
        "Chi-Square Test.md",
        "Co-efficient of correlation, Karl Pearson and Spearman’s rank correlation",
        "Regression Analysis.md",
        "Use of computer and internet in social work practice.md"
      ],
      "Unit 5": [
        "Writing a research report",
        "Social Work research report content and formats",
        "Literature Review and Literature Survey",
        "Problem Identification.md",
        "Specification of Research Questions.md",
        "Rationale and Study Objectives.md",
        "Operational definitions",
        "Research Methodology.md",
        "Research Design.md",
        "Data Collection and Analysis.md",
        "Interpretation of results and discussion.md",
        "Conclusion.md",
        "References.md"
      ]
    }
  },
  "Semester 2": {
    "MSW 201": {
      "Unit 1": ["Community Organization.md"]
    }
  },
  "Semester 3": {
    "MSW 313": {
      "Unit 1": [
        "Demography and Population.md",
        "Sources of Demographic Data.md",
        "Population Growth and its Consequences.md",
        "Population Policy and Programmes.md"
      ],
      "Unit 2": [
        "Determinants of population growth.md",
        "Theories of population",
        "Population Control Measures.md",

      ],
      "Unit 3": [
        "Characteristics of Indian Population.md",
        "Population Composition and Distribution in India.md",
        "Population and Development in India.md",
      ],
      "Unit 4": [
        "Population growth and population policy in India.md",
        "National Population policy.md",
        "Family planning in India.md",
        "Role of social worker in family planning.md"
      ],
      "Unit 5": [
        "Population education.md",
        "population education in educational institutions.md",
        "social work practice and population education.md"
      ]
    },
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
    // Create subject section
    const subjectSection = document.createElement('div');
    subjectSection.classList.add('subject-section');
    
    // Add subject header (collapsible)
    const subjectHeader = document.createElement('div');
    subjectHeader.classList.add('subject-header');
    subjectHeader.textContent = subject;
    
    // Create units container
    const unitsContainer = document.createElement('div');
    unitsContainer.classList.add('units-container');
    
    // Create compact unit list
    for (let unit in structure[currentSemester][subject]) {
      const unitDiv = document.createElement('div');
      unitDiv.classList.add('unit-container');
      
      const unitHeader = document.createElement('div');
      unitHeader.classList.add('unit-header');
      unitHeader.textContent = unit;
      unitDiv.appendChild(unitHeader);
      
      const topicList = document.createElement('div');
      topicList.classList.add('topic-list');
      
      structure[currentSemester][subject][unit].forEach(topic => {
        const topicItem = document.createElement('div');
        topicItem.classList.add('topic-item');
        topicItem.textContent = topic.replace('.md', '');
        topicItem.onclick = () => {
          // Highlight the selected item
          document.querySelectorAll('.active-item').forEach(el => {
            el.classList.remove('active-item');
          });
          topicItem.classList.add('active-item');
          
          const path = `${currentSemester}/${subject}/${unit}/${topic}`;
          loadNote(path);
        };
        topicList.appendChild(topicItem);
      });
      
      unitDiv.appendChild(topicList);
      unitsContainer.appendChild(unitDiv);
    }
    
    subjectSection.appendChild(subjectHeader);
    subjectSection.appendChild(unitsContainer);
    navTree.appendChild(subjectSection);
  }
  
  // Add click handlers to expand/collapse subject headers
  document.querySelectorAll('.subject-header').forEach(header => {
    header.addEventListener('click', function() {
      this.classList.toggle('collapsed');
      const unitsContainer = this.nextElementSibling;
      if (unitsContainer) {
        unitsContainer.classList.toggle('hidden');
      }
    });
  });
  
  // Add click handlers to expand/collapse unit headers
  document.querySelectorAll('.unit-header').forEach(header => {
    header.addEventListener('click', function() {
      this.classList.toggle('collapsed');
      const topicList = this.nextElementSibling;
      if (topicList) {
        topicList.classList.toggle('hidden');
      }
    });
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

// Feedback form using formspree
// === Inject Feedback Button and Form ===
function injectFeedbackForm() {
  const formHTML = `
    <style>
      #feedback-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #007BFF;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      }
      #feedback-form-container {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 300px;
        background: white;
        border: 1px solid #ccc;
        padding: 15px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        border-radius: 8px;
        display: none;
        z-index: 9999;
      }
      #feedback-form-container textarea, 
      #feedback-form-container input {
        width: 100%;
        margin-top: 8px;
        padding: 6px;
        font-size: 14px;
      }
      #feedback-form-container button[type="submit"] {
        background: #007BFF;
        color: white;
        border: none;
        margin-top: 10px;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
      }
    </style>

    <div id="feedback-button">💬 Feedback</div>
    <div id="feedback-form-container">
      <form action="https://formspree.io/f/xyzppdga" method="POST">
        <label>Your Feedback:</label><br>
        <textarea name="message" rows="4" required></textarea><br>
        <input type="email" name="_replyto" placeholder="Your email (optional)"><br>
        <input type="hidden" name="note" value="${document.currentSemester}, ${document.subject}, ${document.unit}">
        <button type="submit">Submit</button>
      </form>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", formHTML);

  const button = document.getElementById("feedback-button");
  const form = document.getElementById("feedback-form-container");

  button.addEventListener("click", () => {
    form.style.display = form.style.display === "none" ? "block" : "none";
  });
}

// Call the function on page load
window.addEventListener("DOMContentLoaded", injectFeedbackForm);

