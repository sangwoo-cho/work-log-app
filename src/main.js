import './style.css'

const app = document.querySelector('#app')

// State
let workLogs = JSON.parse(localStorage.getItem('workLogs')) || []

// Render
function render() {
    app.innerHTML = `
    <header>
      <h1>Work Log</h1>
      <p>Track your daily tasks effectively.</p>
    </header>

    <main>
      <section class="card input-section">
        <h2>New Entry</h2>
        <form id="log-form">
          <div class="form-group">
            <label for="date">Date</label>
            <input type="date" id="date" required value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="form-group">
            <label for="task">Task</label>
            <input type="text" id="task" placeholder="What did you do today?" required>
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status">
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
          <button type="submit">Add Log</button>
        </form>
      </section>

      <section class="card list-section">
        <h2>History</h2>
        ${workLogs.length === 0 ? '<p class="empty-state">No logs yet. Start tracking work!</p>' : ''}
        <ul class="log-list">
          ${workLogs.map((log, index) => `
            <li class="log-item ${log.status.toLowerCase().replace(' ', '-')}">
              <div class="log-details">
                <span class="log-date">${log.date}</span>
                <span class="log-status badge">${log.status}</span>
                <p class="log-task">${log.task}</p>
              </div>
              <button class="delete-btn" data-index="${index}" aria-label="Delete log">
                &times;
              </button>
            </li>
          `).join('')}
        </ul>
      </section>
    </main>
  `

    attachEvents()
}

// Event Listeners
function attachEvents() {
    const form = document.getElementById('log-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const date = document.getElementById('date').value
        const task = document.getElementById('task').value
        const status = document.getElementById('status').value

        workLogs.unshift({ date, task, status })
        saveAndRender()
    })

    const deleteBtns = document.querySelectorAll('.delete-btn')
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index)
            workLogs.splice(index, 1)
            saveAndRender()
        })
    })
}

function saveAndRender() {
    localStorage.setItem('workLogs', JSON.stringify(workLogs))
    render()
}

// Initial Render
render()

