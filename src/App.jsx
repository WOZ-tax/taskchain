import React, { useState } from 'react';
import {
  Menu, X, CheckCircle, Clock, Circle, User,
  Calendar, MessageSquare, MoreVertical,
  LayoutDashboard, CheckSquare, Users, Settings,
  ChevronRight, Plus
} from 'lucide-react';

const mockTasks = [
  { id: 1, title: '要件定義とスコープ設定', status: 'completed', assignee: 'Alice', date: '4月1日', description: 'クライアントとのキックオフMTGの内容をもとに、プロジェクトの要件とスコープを明確にし、ドキュメントにまとめる。' },
  { id: 2, title: 'UIワイヤーフレーム作成', status: 'completed', assignee: 'Bob', date: '4月5日', description: 'Figmaを使用して、主要な3画面（ダッシュボード、タスク一覧、設定）のワイヤーフレームを作成する。' },
  { id: 3, title: 'フロントエンド実装', status: 'in-progress', assignee: 'Charlie', date: '4月12日', description: 'ReactとTailwind CSSを用いて、ワイヤーフレームをもとにフロントエンドのコーディングを行う。' },
  { id: 4, title: 'バックエンドAPI開発', status: 'todo', assignee: 'Dave', date: '4月15日', description: 'Node.js/Expressを使用して、タスクのCRUD操作を行うためのREST APIエンドポイントを構築する。' },
  { id: 5, title: '結合テストとデプロイ', status: 'todo', assignee: 'Eve', date: '4月20日', description: 'フロントエンドとバックエンドを結合し、E2Eテストを実施後、本番環境へデプロイする。' },
];

const NavItem = ({ icon: Icon, label, active }) => (
  <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
    <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
    <span className={`font-medium text-sm ${active ? 'font-semibold' : ''}`}>{label}</span>
  </button>
);

export default function App() {
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState(mockTasks[2]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2 text-indigo-600">
            <div className="bg-indigo-600 text-white p-1 rounded-md"><CheckSquare className="w-5 h-5" /></div>
            <span className="text-xl font-bold tracking-tight hidden sm:block text-gray-900">TaskChain</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"><MoreVertical className="w-5 h-5" /></button>
          <div className="w-8 h-8 rounded-full border-2 border-indigo-100 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all">
            <img src="https://i.pravatar.cc/150?u=current_user" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {isMobileMenuOpen && <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col shadow-2xl lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 lg:hidden border-b border-gray-100">
            <span className="font-bold text-lg text-gray-800 flex items-center"><CheckSquare className="w-5 h-5 text-indigo-600 mr-2" /> TaskChain</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-md"><X className="w-5 h-5" /></button>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <NavItem icon={LayoutDashboard} label="ダッシュボード" />
            <NavItem icon={CheckSquare} label="マイタスク" />
            <NavItem icon={Users} label="チームメンバー" />
            <div className="pt-6 mt-2">
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex justify-between items-center">Projects<Plus className="w-4 h-4 cursor-pointer hover:text-indigo-500" /></p>
              <NavItem icon={Circle} label="新製品ローンチ" active={true} />
              <NavItem icon={Circle} label="ウェブサイトリニューアル" />
              <NavItem icon={Circle} label="Q3 マーケティング" />
            </div>
          </nav>
          <div className="p-3 border-t border-gray-100"><NavItem icon={Settings} label="設定" /></div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#f8fafc] relative">
          <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 pb-24">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>Projects</span><ChevronRight className="w-4 h-4 mx-1" /><span className="font-medium text-indigo-600">新製品ローンチ</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">タスクチェーン</h1>
              </div>
              <button className="hidden sm:flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors"><Plus className="w-4 h-4" /><span>タスク追加</span></button>
            </div>

            <div className="py-2 relative">
              {tasks.map((task, index) => (
                <div key={task.id} className="flex flex-col items-center w-full group/chain">
                  <div onClick={() => handleTaskClick(task)} className={`w-full max-w-lg bg-white rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-200 flex items-center justify-between ${selectedTask?.id === task.id ? 'border-2 border-indigo-500 shadow-md ring-4 ring-indigo-50/50 scale-[1.02]' : 'border border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md'}`}>
                    <div className="flex-1 pr-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`flex items-center text-[11px] sm:text-xs font-bold px-2 py-1 rounded-md ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {task.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {task.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                          {task.status === 'todo' && <Circle className="w-3 h-3 mr-1" />}
                          {task.status === 'completed' ? '完了' : task.status === 'in-progress' ? '進行中' : '未着手'}
                        </span>
                        <span className="text-xs text-gray-400 font-medium flex items-center"><Calendar className="w-3 h-3 mr-1" />{task.date}</span>
                      </div>
                      <h3 className={`font-bold text-base sm:text-lg transition-colors ${selectedTask?.id === task.id ? 'text-indigo-900' : 'text-gray-900 group-hover/chain:text-indigo-600'}`}>{task.title}</h3>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="hidden sm:flex flex-col items-end mr-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assignee</span>
                        <span className="text-sm font-medium text-gray-700">{task.assignee}</span>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 relative">
                        <img src={`https://i.pravatar.cc/150?u=${task.assignee}`} alt={task.assignee} className="w-full h-full object-cover" />
                        {task.status === 'completed' && <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center"></div>}
                      </div>
                    </div>
                  </div>
                  {index < tasks.length - 1 && <div className={`h-6 sm:h-8 w-1.5 rounded-full my-1.5 transition-colors duration-300 ${task.status === 'completed' ? 'bg-emerald-200' : 'bg-gray-200'}`}></div>}
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-2 pb-8">
              <button className="w-10 h-10 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 transition-all shadow-sm"><Plus className="w-5 h-5" /></button>
            </div>
          </div>
        </main>

        {isDetailOpen && <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity" onClick={() => setIsDetailOpen(false)}></div>}
        <aside className={`fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col lg:translate-x-0 lg:static lg:w-80 xl:w-96 shadow-2xl lg:shadow-none ${isDetailOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedTask ? (
            <>
              <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0 bg-white">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Task Details</span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md hidden lg:block transition-colors"><MoreVertical className="w-5 h-5" /></button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md lg:hidden transition-colors" onClick={() => setIsDetailOpen(false)}><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-tight">{selectedTask.title}</h2>
                  <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center">
                      <div className="w-28 text-sm font-medium text-gray-500 flex items-center"><User className="w-4 h-4 mr-2 opacity-70"/> 担当者</div>
                      <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50">
                        <img src={`https://i.pravatar.cc/150?u=${selectedTask.assignee}`} alt="avatar" className="w-5 h-5 rounded-full" />
                        <span className="text-sm font-medium text-gray-900">{selectedTask.assignee}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-28 text-sm font-medium text-gray-500 flex items-center"><Calendar className="w-4 h-4 mr-2 opacity-70"/> 期日</div>
                      <div className="text-sm font-medium text-gray-900 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">{selectedTask.date}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-28 text-sm font-medium text-gray-500 flex items-center"><CheckCircle className="w-4 h-4 mr-2 opacity-70"/> ステータス</div>
                      <select className="text-sm font-medium bg-white border border-gray-200 shadow-sm rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer" value={selectedTask.status} onChange={(e) => { const newTasks = tasks.map(t => t.id === selectedTask.id ? { ...t, status: e.target.value } : t); setTasks(newTasks); setSelectedTask({...selectedTask, status: e.target.value}); }}>
                        <option value="todo">未着手</option>
                        <option value="in-progress">進行中</option>
                        <option value="completed">完了</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center"><LayoutDashboard className="w-4 h-4 mr-2 text-gray-400"/> 詳細説明</h3>
                  <div className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-h-[100px]">{selectedTask.description}</div>
                </div>
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-gray-400"/> サブタスク</h3>
                  <div className="space-y-2">
                    <label className="flex items-start space-x-3 p-3 bg-white border border-gray-100 shadow-sm rounded-lg cursor-pointer hover:border-indigo-300 transition-colors group">
                      <input type="checkbox" className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" defaultChecked={selectedTask.status === 'completed'} />
                      <span className={`text-sm ${selectedTask.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700 group-hover:text-indigo-900'}`}>必要なドキュメントのフォーマット作成</span>
                    </label>
                    <label className="flex items-start space-x-3 p-3 bg-white border border-gray-100 shadow-sm rounded-lg cursor-pointer hover:border-indigo-300 transition-colors group">
                      <input type="checkbox" className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                      <span className="text-sm text-gray-700 group-hover:text-indigo-900">関係各所へのレビュー依頼とフィードバック反映</span>
                    </label>
                  </div>
                  <button className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center"><Plus className="w-4 h-4 mr-1" /> アイテムを追加</button>
                </div>
                <div className="pb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center"><MessageSquare className="w-4 h-4 mr-2 text-gray-400"/> アクティビティ</h3>
                  <div className="flex space-x-3">
                    <img src="https://i.pravatar.cc/150?u=current_user" alt="me" className="w-8 h-8 rounded-full mt-1 shrink-0" />
                    <div className="flex-1">
                      <textarea className="w-full text-sm border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all shadow-sm" rows="3" placeholder="質問や進捗をコメント..."></textarea>
                      <div className="flex justify-end mt-2">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm">コメントを送信</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4"><MessageSquare className="w-8 h-8 text-gray-300" /></div>
              <p className="font-medium text-gray-500">タスクを選択すると<br/>ここに詳細が表示されます。</p>
            </div>
          )}
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar{width:6px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background-color:#e2e8f0;border-radius:10px}.custom-scrollbar:hover::-webkit-scrollbar-thumb{background-color:#cbd5e1}`}} />
    </div>
  );
}
