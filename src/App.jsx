import React, { useState, useEffect, useRef } from 'react';

const DUMMY_TEAMS = ['전체', '통합지원팀', '운영지원팀', '기술지원팀', '기획팀'];
const ALL_MEMBERS = ['홍길동', '김철수', '이영희', '박민수', '정소희', '최재원', '강호동', '유재석', '송강호', '정우성', '이병헌'];

const CATEGORIES_MAP = {
  office: { id: 'office', title: '사무', color: '#1a73e8' },
  accounting: { id: 'accounting', title: '회계', color: '#f9ab00' },
  admin: { id: 'admin', title: '행정', color: '#188038' },
  etc: { id: 'etc', title: '환경/기타', color: '#d93025' },
};

const INITIAL_TASKS = [
  { id: 1, categoryId: 'office', content: '주간 업무 보고서 작성 및 취합', participants: ['홍길동', '김철수'], completed: false, team: '통합지원팀', date: '2026-02-23', time: '오전' },
  { id: 2, categoryId: 'office', content: '문서 보안 파쇄업체 일정 확정', participants: ['이영희'], completed: true, team: '운영지원팀', date: '2026-02-23', time: '오전' },
  { id: 3, categoryId: 'accounting', content: '2월분 법인카드 정산 및 증빙 제출', participants: ['박민수'], completed: false, team: '기획팀', date: '2026-02-23', time: '오후' },
  { id: 4, categoryId: 'accounting', content: '부품 구매 결재 상신', participants: ['정소희'], completed: false, team: '기술지원팀', date: '2026-02-23', time: '오전' },
  { id: 5, categoryId: 'admin', content: '신규 입사자 사무기기 세팅', participants: ['최재원'], completed: false, team: '통합지원팀', date: '2026-02-23', time: '오후' },
  { id: 6, categoryId: 'etc', content: '회의실 75인치 TV 시스템 점검', participants: ['김철수', '박민수'], completed: false, team: '기술지원팀', date: '2026-02-24', time: '오전' },
];

const Header = ({ filterDate, setFilterDate, filterTime, setFilterTime, filterTeam, setFilterTeam }) => (
  <header style={styles.header}>
    <div style={styles.logoArea}>
      <h1 style={styles.logo}>일일 업무 배정</h1>
    </div>
    <div style={styles.controls}>
      <input
        type="date"
        style={styles.select}
        value={filterDate}
        onChange={e => setFilterDate(e.target.value)}
      />
      <select style={styles.select} value={filterTime} onChange={e => setFilterTime(e.target.value)}>
        <option value="전체">전체 시간</option>
        <option value="오전">오전</option>
        <option value="오후">오후</option>
      </select>
      <select style={styles.select} value={filterTeam} onChange={e => setFilterTeam(e.target.value)}>
        {DUMMY_TEAMS.map(team => <option key={team} value={team}>{team}</option>)}
      </select>
    </div>
  </header>
);

const SmartAutocomplete = ({ selected, onUpdate }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMembers = ALL_MEMBERS.filter(member =>
    member.includes(query) && !selected.includes(member)
  );

  const handleSelect = (member) => {
    onUpdate([...selected, member]);
    setQuery('');
    setIsOpen(false);
  };

  const handleRemove = (member) => {
    onUpdate(selected.filter(m => m !== member));
  };

  return (
    <div ref={wrapperRef} style={styles.autocompleteWrapper}>
      <div style={styles.autocompleteInputContainer} onClick={() => setIsOpen(true)}>
        {selected.slice(0, 3).map(member => (
          <div key={member} style={styles.activeBadge}>
            {member} <span onClick={(e) => { e.stopPropagation(); handleRemove(member); }} style={styles.removeIcon}>×</span>
          </div>
        ))}
        {selected.length > 3 && <span style={styles.plusMoreText}>외 {selected.length - 3}명</span>}
        <input
          style={styles.ghostInput}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          placeholder={selected.length === 0 ? "담당자 추가..." : ""}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && filteredMembers.length > 0) {
              handleSelect(filteredMembers[0]);
            }
          }}
        />
      </div>

      {isOpen && filteredMembers.length > 0 && (
        <div style={styles.suggestionsList}>
          {filteredMembers.map(member => (
            <div
              key={member}
              style={styles.suggestionItem}
              onClick={() => handleSelect(member)}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {member}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const WorkCard = ({ task, onToggleComplete, onUpdateParticipants }) => {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.checkboxWrapper} onClick={() => onToggleComplete(task.id)}>
          <div style={{ ...styles.customCheckbox, borderColor: task.completed ? '#1f2937' : '#e2e8f0', backgroundColor: task.completed ? '#1f2937' : 'transparent' }}>
            {task.completed && (
              <svg viewBox="0 0 24 24" style={styles.checkMark}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" />
              </svg>
            )}
          </div>
        </div>
        <p style={{
          ...styles.taskContent,
          textDecoration: task.completed ? 'line-through' : 'none',
          color: task.completed ? '#9ca3af' : '#1f2937'
        }}>
          {task.content}
        </p>
      </div>

      <div style={styles.cardFooter}>
        <SmartAutocomplete
          selected={task.participants}
          onUpdate={(newParticipants) => onUpdateParticipants(task.id, newParticipants)}
        />
      </div>
    </div>
  );
};

function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const [filterDate, setFilterDate] = useState('2026-02-23');
  const [filterTime, setFilterTime] = useState('전체');
  const [filterTeam, setFilterTeam] = useState('전체');

  const filteredTasks = tasks.filter(task => {
    const matchDate = filterDate ? task.date === filterDate : true;
    const matchTime = filterTime !== '전체' ? task.time === filterTime : true;
    const matchTeam = filterTeam !== '전체' ? task.team === filterTeam : true;
    return matchDate && matchTime && matchTeam;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('office');
  const [newTeam, setNewTeam] = useState('통합지원팀');

  const handleAdd = () => {
    if (newContent.trim()) {
      const newTask = {
        id: Date.now(),
        categoryId: newCategory,
        content: newContent,
        participants: [],
        completed: false,
        team: newTeam,
        date: filterDate || new Date().toISOString().split('T')[0],
        time: filterTime !== '전체' ? filterTime : '오전'
      };
      setTasks(prev => [...prev, newTask]);
      setNewContent('');
      setIsAdding(false);
    }
  };

  const toggleComplete = (taskId) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const updateAllParticipants = (taskId, newParticipants) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, participants: newParticipants } : t
    ));
  };

  return (
    <div style={styles.container}>
      <Header
        filterDate={filterDate} setFilterDate={setFilterDate}
        filterTime={filterTime} setFilterTime={setFilterTime}
        filterTeam={filterTeam} setFilterTeam={setFilterTeam}
      />
      <main style={styles.main}>
        <div style={styles.gridContainer}>
          {filteredTasks.map(task => (
            <WorkCard
              key={task.id}
              task={task}
              onToggleComplete={toggleComplete}
              onUpdateParticipants={updateAllParticipants}
            />
          ))}
          {filteredTasks.length === 0 && (
            <div style={styles.emptyState}>해당 조건의 업무가 없습니다.</div>
          )}
        </div>
      </main>

      <button style={styles.fab} onClick={() => setIsAdding(true)}>
        +
      </button>

      {isAdding && (
        <div style={styles.modalOverlay} onClick={() => setIsAdding(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>새 업무 추가</h2>
            <div style={styles.inputMeta}>
              <select style={styles.modalSelect} value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                {Object.values(CATEGORIES_MAP).map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
              </select>
              <select style={styles.modalSelect} value={newTeam} onChange={e => setNewTeam(e.target.value)}>
                {DUMMY_TEAMS.filter(t => t !== '전체').map(team => <option key={team} value={team}>{team}</option>)}
              </select>
            </div>
            <textarea
              autoFocus
              style={styles.textInput}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAdd())}
              placeholder="업무 내용을 입력하세요..."
              rows={3}
            />
            <div style={styles.inputActions}>
              <button onClick={() => setIsAdding(false)} style={styles.cancelBtn}>취소</button>
              <button onClick={handleAdd} style={styles.saveBtn}>추가하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 3.5rem',
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0,0,0,0.03)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-1px',
    margin: 0,
  },
  controls: {
    display: 'flex',
    gap: '12px',
  },
  select: {
    padding: '10px 18px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#334155',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    outline: 'none',
    WebkitAppearance: 'none',
  },
  main: {
    padding: '2.5rem 3.5rem',
    flex: 1,
    overflowY: 'auto',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '1.5rem',
    alignItems: 'start',
  },
  card: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    backgroundColor: '#ffffff',
    borderRadius: '1.25rem', // 20px
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9',
    transition: 'box-shadow 0.2s ease-in-out',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
  },
  checkboxWrapper: {
    cursor: 'pointer',
    marginTop: '2px',
    flexShrink: 0,
  },
  customCheckbox: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  checkMark: {
    width: '14px',
    height: '14px',
  },
  taskContent: {
    fontSize: '1.25rem',
    lineHeight: '1.5',
    fontWeight: '600',
    flex: 1,
    margin: 0,
    wordBreak: 'keep-all',
  },
  cardFooter: {
    paddingLeft: '38px',
  },
  autocompleteWrapper: {
    position: 'relative',
    width: '100%',
  },
  autocompleteInputContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center',
    minHeight: '40px',
  },
  activeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#f1f5f9',
    borderRadius: '100px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#0f172a',
  },
  removeIcon: {
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '1.1rem',
    lineHeight: '1',
  },
  plusMoreText: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#64748b',
  },
  ghostInput: {
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#475569',
    flex: 1,
    padding: '4px',
    minWidth: '100px',
  },
  suggestionsList: {
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '240px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    marginTop: '8px',
    maxHeight: '220px',
    overflowY: 'auto',
    zIndex: 50,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
    padding: '8px',
  },
  suggestionItem: {
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1e293b',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  fab: {
    position: 'fixed',
    bottom: '2.5rem',
    right: '2.5rem',
    width: '64px',
    height: '64px',
    borderRadius: '32px',
    backgroundColor: '#0f172a',
    color: '#fff',
    border: 'none',
    fontSize: '2rem',
    fontWeight: '300',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    zIndex: 1000,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  inputMeta: {
    display: 'flex',
    gap: '10px',
  },
  modalSelect: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#f8fafc',
    color: '#334155',
    outline: 'none',
  },
  textInput: {
    width: '100%',
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#0f172a',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
    backgroundColor: '#f8fafc',
  },
  inputActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  saveBtn: {
    padding: '12px 28px',
    backgroundColor: '#0f172a',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1.05rem',
  },
  cancelBtn: {
    padding: '12px 28px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1.05rem',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#94a3b8',
  },
};

export default App;
