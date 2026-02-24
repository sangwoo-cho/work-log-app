import React, { useState, useEffect, useRef } from 'react';

const DUMMY_TEAMS = ['전체', '통합지원팀', '운영지원팀', '기술지원팀', '기획팀'];
const ALL_MEMBERS = ['홍길동', '김철수', '이영희', '박민수', '정소희', '최재원', '강호동', '유재석', '송강호', '정우성', '이병헌'];

const CATEGORIES_MAP = {
  office: { id: 'office', title: '사무', color: '#1a73e8', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
  accounting: { id: 'accounting', title: '회계', color: '#f9ab00', icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z' },
  admin: { id: 'admin', title: '행정', color: '#188038', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' },
  etc: { id: 'etc', title: '환경/기타', color: '#d93025', icon: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z' },
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
        style={styles.datePicker} 
        value={filterDate} 
        onChange={e => setFilterDate(e.target.value)} 
      />
      <select style={styles.select} value={filterTime} onChange={e => setFilterTime(e.target.value)}>
        <option value="전체">시간대 전체</option>
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
          placeholder={selected.length === 0 ? "참여자 검색..." : ""}
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
  const category = CATEGORIES_MAP[task.categoryId] || CATEGORIES_MAP['etc'];
  const categoryColor = category.color;

  return (
    <div className="soft-ui-card" style={{ ...styles.card, borderLeft: `6px solid ${categoryColor}` }}>
      <div style={styles.cardInfoMeta}>
        <span style={{ ...styles.categoryBadge, color: categoryColor, backgroundColor: \`\${categoryColor}15\` }}>
          {category.title}
        </span>
        <span style={styles.teamBadge}>{task.team}</span>
        <span style={styles.timeBadge}>{task.date} · {task.time}</span>
      </div>
      <div style={styles.cardHeader}>
        <div style={styles.checkboxWrapper} onClick={() => onToggleComplete(task.id)}>
          <div style={{ ...styles.customCheckbox, borderColor: task.completed ? categoryColor : '#e2e8f0', backgroundColor: task.completed ? categoryColor : 'transparent' }}>
            {task.completed && <svg viewBox="0 0 24 24" style={styles.checkMark}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" /></svg>}
          </div>
        </div>
        <p style={{
          ...styles.taskContent,
          textDecoration: task.completed ? 'line-through' : 'none',
          color: task.completed ? '#a0aec0' : '#2d3748'
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
  
  // 필터 상태
  const [filterDate, setFilterDate] = useState('2026-02-23');
  const [filterTime, setFilterTime] = useState('전체');
  const [filterTeam, setFilterTeam] = useState('전체');

  // 필터링 적용
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
        {/* 새 업무 추가 영역 */}
        {isAdding ? (
          <div className="soft-ui-card" style={styles.inputCard}>
            <div style={styles.inputMeta}>
              <select style={styles.selectSmall} value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                {Object.values(CATEGORIES_MAP).map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
              </select>
              <select style={styles.selectSmall} value={newTeam} onChange={e => setNewTeam(e.target.value)}>
                {DUMMY_TEAMS.filter(t => t !== '전체').map(team => <option key={team} value={team}>{team}</option>)}
              </select>
            </div>
            <input
              autoFocus
              style={styles.textInput}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="업무 내용을 입력하세요..."
            />
            <div style={styles.inputActions}>
              <button onClick={handleAdd} style={styles.saveBtn}>저장</button>
              <button onClick={() => setIsAdding(false)} style={styles.cancelBtn}>취소</button>
            </div>
          </div>
        ) : (
          <button style={styles.addCardButton} onClick={() => setIsAdding(true)}>
            + 새 업무 추가
          </button>
        )}

        {/* 필터링된 업무 카드 목록 (반응형 그리드) */}
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
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f4f6f8',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 3.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    zIndex: 100,
  },
  logo: {
    fontSize: '2rem',
    fontWeight: '900',
    color: '#1a202c',
    letterSpacing: '-1.5px',
    background: 'linear-gradient(135deg, #1a202c 0%, #4a5568 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  controls: {
    display: 'flex',
    gap: '16px',
  },
  datePicker: {
    padding: '10px 20px',
    borderRadius: '14px',
    border: '1px solid #eef2f7',
    fontSize: '1.1rem',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  select: {
    padding: '10px 20px',
    borderRadius: '14px',
    border: '1px solid #eef2f7',
    fontSize: '1.1rem',
    fontWeight: '700',
    backgroundColor: '#fff',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  main: {
    padding: '2.5rem 3.5rem',
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '1.5rem',
    alignItems: 'start',
  },
  card: {
    padding: '1.4rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
  },
  cardInfoMeta: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '4px',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '800',
  },
  teamBadge: {
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '700',
    backgroundColor: '#f1f5f9',
    color: '#475569',
  },
  timeBadge: {
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '700',
    backgroundColor: '#f1f5f9',
    color: '#475569',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  checkboxWrapper: {
    cursor: 'pointer',
    marginTop: '4px',
  },
  customCheckbox: {
    width: '26px',
    height: '26px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  checkMark: {
    width: '18px',
    height: '18px',
  },
  taskContent: {
    fontSize: '1.4rem',
    lineHeight: '1.5',
    fontWeight: '700',
    flex: 1,
    margin: 0,
  },
  cardFooter: {
    paddingLeft: '36px',
  },
  autocompleteWrapper: {
    position: 'relative',
    width: '100%',
  },
  autocompleteInputContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '8px 12px',
    border: '1.5px solid #f0f4f8',
    borderRadius: '14px',
    backgroundColor: '#f8fafc',
    minHeight: '54px',
    cursor: 'text',
    alignItems: 'center',
  },
  activeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    backgroundColor: '#fff',
    borderRadius: '24px',
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#1a202c',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  removeIcon: {
    color: '#cbd5e0',
    cursor: 'pointer',
    fontSize: '1.2rem',
    lineHeight: '1',
  },
  plusMoreText: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#94a3b8',
  },
  ghostInput: {
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '1.1rem',
    flex: 1,
    padding: '4px',
    minWidth: '80px',
  },
  suggestionsList: {
    position: 'absolute',
    top: '100%',
    left: '0',
    right: '0',
    backgroundColor: '#fff',
    border: '1px solid #eef2f7',
    borderRadius: '16px',
    marginTop: '8px',
    maxHeight: '240px',
    overflowY: 'auto',
    zIndex: 50,
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    padding: '8px',
  },
  suggestionItem: {
    padding: '12px 18px',
    borderRadius: '10px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  addCardButton: {
    padding: '1.5rem',
    borderRadius: '18px',
    border: '2.5px dashed #cbd5e1',
    backgroundColor: 'transparent',
    color: '#64748b',
    fontSize: '1.2rem',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'block',
    width: '100%',
  },
  inputCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  },
  inputMeta: {
    display: 'flex',
    gap: '12px',
  },
  selectSmall: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#f8fafc',
    outline: 'none',
  },
  textInput: {
    width: '100%',
    padding: '14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '600',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '8px',
  },
  saveBtn: {
    padding: '10px 24px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  cancelBtn: {
    padding: '10px 24px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1.1rem',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '4rem',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#94a3b8',
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '2px dashed #e2e8f0',
  },
};

export default App;
