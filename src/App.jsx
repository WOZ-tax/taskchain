import React, { useState } from 'react';
import {
  Menu, X, CheckCircle, Clock, Circle, User, Building2,
  Calendar, MessageSquare, MoreVertical, Users2, ArrowRight,
  LayoutDashboard, CheckSquare, Users, Settings, Workflow,
  ChevronRight, Plus, GripVertical, Link2, Tag, Briefcase
} from 'lucide-react';

// ===== マスタデータ =====

const clients = [
  { id: 'c1', name: 'A社（株式会社アルファ）', industry: '製造業', plan: '経理+労務+総務', contractStart: '2024年4月', note: '従業員50名、月次訪問あり' },
  { id: 'c2', name: 'B社（ベータ合同会社）', industry: 'IT', plan: '経理のみ', contractStart: '2025年1月', note: '従業員12名、フルリモート対応' },
  { id: 'c3', name: 'C社（ガンマ株式会社）', industry: '飲食', plan: '経理+労務', contractStart: '2023年10月', note: '3店舗、従業員80名（パート含む）' },
];

const members = [
  { id: 'm1', name: '田中 美咲', role: '経理担当', skills: ['記帳', '月次決算', '請求書発行'], capacity: 5 },
  { id: 'm2', name: '佐藤 健一', role: '労務担当', skills: ['給与計算', '社会保険', '勤怠管理'], capacity: 4 },
  { id: 'm3', name: '鈴木 あゆみ', role: '経理・総務', skills: ['記帳', '請求書発行', '届出管理'], capacity: 5 },
  { id: 'm4', name: '高橋 大輔', role: '労務・人事', skills: ['給与計算', '入退社手続', '年末調整'], capacity: 3 },
  { id: 'm5', name: '渡辺 裕子', role: 'マネージャー', skills: ['月次レポート', '品質管理', 'クライアント対応'], capacity: 6 },
];

const workflows = [
  {
    id: 'wf1', name: '月次経理BPO', category: '経理',
    steps: [
      { id: 's1', name: '証憑回収・確認', order: 1, dueDay: 3, skillRequired: '記帳' },
      { id: 's2', name: '仕訳入力・記帳', order: 2, dueDay: 7, skillRequired: '記帳' },
      { id: 's3', name: '請求書発行・送付', order: 3, dueDay: 10, skillRequired: '請求書発行' },
      { id: 's4', name: '入金消込・売掛管理', order: 4, dueDay: 15, skillRequired: '記帳' },
      { id: 's5', name: '月次試算表作成・報告', order: 5, dueDay: 20, skillRequired: '月次決算' },
    ]
  },
  {
    id: 'wf2', name: '月次労務BPO', category: '労務',
    steps: [
      { id: 's6', name: '勤怠データ締め・確認', order: 1, dueDay: 5, skillRequired: '勤怠管理' },
      { id: 's7', name: '給与計算・明細作成', order: 2, dueDay: 10, skillRequired: '給与計算' },
      { id: 's8', name: '社会保険手続き', order: 3, dueDay: 15, skillRequired: '社会保険' },
      { id: 's9', name: '入退社手続き', order: 4, dueDay: 20, skillRequired: '入退社手続' },
    ]
  },
  {
    id: 'wf3', name: '月次総務BPO', category: '総務',
    steps: [
      { id: 's10', name: '届出・届出書類管理', order: 1, dueDay: 10, skillRequired: '届出管理' },
      { id: 's11', name: '備品・契約管理', order: 2, dueDay: 15, skillRequired: '届出管理' },
    ]
  },
];

// 顧客×ワークフロー×担当者の割当（これがデータモデルの核心）
const assignments = [
  // A社: 経理+労務+総務
  { clientId: 'c1', workflowId: 'wf1', stepId: 's1', memberId: 'm1' },
  { clientId: 'c1', workflowId: 'wf1', stepId: 's2', memberId: 'm1' },
  { clientId: 'c1', workflowId: 'wf1', stepId: 's3', memberId: 'm3' },
  { clientId: 'c1', workflowId: 'wf1', stepId: 's4', memberId: 'm1' },
  { clientId: 'c1', workflowId: 'wf1', stepId: 's5', memberId: 'm5' },
  { clientId: 'c1', workflowId: 'wf2', stepId: 's6', memberId: 'm2' },
  { clientId: 'c1', workflowId: 'wf2', stepId: 's7', memberId: 'm2' },
  { clientId: 'c1', workflowId: 'wf2', stepId: 's8', memberId: 'm4' },
  { clientId: 'c1', workflowId: 'wf2', stepId: 's9', memberId: 'm4' },
  { clientId: 'c1', workflowId: 'wf3', stepId: 's10', memberId: 'm3' },
  { clientId: 'c1', workflowId: 'wf3', stepId: 's11', memberId: 'm3' },
  // B社: 経理のみ
  { clientId: 'c2', workflowId: 'wf1', stepId: 's1', memberId: 'm3' },
  { clientId: 'c2', workflowId: 'wf1', stepId: 's2', memberId: 'm3' },
  { clientId: 'c2', workflowId: 'wf1', stepId: 's3', memberId: 'm3' },
  { clientId: 'c2', workflowId: 'wf1', stepId: 's4', memberId: 'm3' },
  { clientId: 'c2', workflowId: 'wf1', stepId: 's5', memberId: 'm5' },
  // C社: 経理+労務
  { clientId: 'c3', workflowId: 'wf1', stepId: 's1', memberId: 'm1' },
  { clientId: 'c3', workflowId: 'wf1', stepId: 's2', memberId: 'm1' },
  { clientId: 'c3', workflowId: 'wf1', stepId: 's3', memberId: 'm1' },
  { clientId: 'c3', workflowId: 'wf1', stepId: 's4', memberId: 'm1' },
  { clientId: 'c3', workflowId: 'wf1', stepId: 's5', memberId: 'm5' },
  { clientId: 'c3', workflowId: 'wf2', stepId: 's6', memberId: 'm4' },
  { clientId: 'c3', workflowId: 'wf2', stepId: 's7', memberId: 'm4' },
  { clientId: 'c3', workflowId: 'wf2', stepId: 's8', memberId: 'm2' },
  { clientId: 'c3', workflowId: 'wf2', stepId: 's9', memberId: 'm2' },
];

// 今月のタスク実行インスタンス（割当から生成される）
const taskInstances = assignments.map((a, i) => {
  const wf = workflows.find(w => w.id === a.workflowId);
  const step = wf.steps.find(s => s.id === a.stepId);
  const statuses = ['completed', 'completed', 'in-progress', 'todo', 'todo'];
  const statusIndex = Math.min(step.order - 1, 4);
  return {
    id: `t${i + 1}`,
    clientId: a.clientId,
    workflowId: a.workflowId,
    stepId: a.stepId,
    memberId: a.memberId,
    stepName: step.name,
    workflowName: wf.name,
    dueDate: `4月${step.dueDay}日`,
    status: statuses[statusIndex],
    month: '2026年4月',
  };
});

// ===== ヘルパー =====
const getClient = (id) => clients.find(c => c.id === id);
const getMember = (id) => members.find(m => m.id === id);
const getWorkflow = (id) => workflows.find(w => w.id === id);

const statusLabel = (s) => s === 'completed' ? '完了' : s === 'in-progress' ? '進行中' : '未着手';
const statusColor = (s) => s === 'completed' ? 'bg-emerald-100 text-emerald-700' : s === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600';
const StatusIcon = ({ status }) => status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : status === 'in-progress' ? <Clock className="w-3 h-3 mr-1" /> : <Circle className="w-3 h-3 mr-1" />;
const categoryColor = (c) => c === '経理' ? 'bg-violet-100 text-violet-700' : c === '労務' ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700';

// ===== コンポーネント =====

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
    <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
    <span className={`font-medium text-sm ${active ? 'font-semibold' : ''}`}>{label}</span>
  </button>
);

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md ${className}`}>{children}</span>
);

// ---------- 顧客管理 ----------
function ClientsView({ onSelectClient, selectedClientId }) {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">顧客管理</h1>
          <p className="text-sm text-gray-500 mt-1">BPO契約中の顧客と適用ワークフロー・担当者の管理</p>
        </div>
        <button className="hidden sm:flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors"><Plus className="w-4 h-4" /><span>顧客追加</span></button>
      </div>
      <div className="space-y-3">
        {clients.map(client => {
          const clientWfs = [...new Set(assignments.filter(a => a.clientId === client.id).map(a => a.workflowId))];
          const clientMembers = [...new Set(assignments.filter(a => a.clientId === client.id).map(a => a.memberId))];
          const tasks = taskInstances.filter(t => t.clientId === client.id);
          const done = tasks.filter(t => t.status === 'completed').length;
          return (
            <div key={client.id} onClick={() => onSelectClient(client.id)}
              className={`bg-white rounded-xl p-4 sm:p-5 cursor-pointer transition-all border ${selectedClientId === client.id ? 'border-indigo-500 shadow-md ring-2 ring-indigo-50' : 'border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{client.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-gray-100 text-gray-600"><Building2 className="w-3 h-3 mr-1" />{client.industry}</Badge>
                    <Badge className="bg-indigo-50 text-indigo-600"><Briefcase className="w-3 h-3 mr-1" />{client.plan}</Badge>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{client.contractStart}〜</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center"><Workflow className="w-3.5 h-3.5 mr-1 text-gray-400" />WF: {clientWfs.length}本</span>
                <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1 text-gray-400" />担当: {clientMembers.length}名</span>
                <span className="flex items-center"><CheckSquare className="w-3.5 h-3.5 mr-1 text-gray-400" />今月: {done}/{tasks.length}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClientDetail({ clientId }) {
  const client = getClient(clientId);
  if (!client) return <EmptyDetail message="顧客を選択してください" />;
  const clientAssignments = assignments.filter(a => a.clientId === clientId);
  const clientWfIds = [...new Set(clientAssignments.map(a => a.workflowId))];

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
      <h2 className="text-xl font-bold text-gray-900 mb-1">{client.name}</h2>
      <p className="text-sm text-gray-500 mb-6">{client.note}</p>

      <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-6">
        <div className="flex items-center"><div className="w-24 text-sm text-gray-500">業種</div><span className="text-sm font-medium text-gray-900">{client.industry}</span></div>
        <div className="flex items-center"><div className="w-24 text-sm text-gray-500">契約内容</div><span className="text-sm font-medium text-gray-900">{client.plan}</span></div>
        <div className="flex items-center"><div className="w-24 text-sm text-gray-500">契約開始</div><span className="text-sm font-medium text-gray-900">{client.contractStart}</span></div>
      </div>

      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center"><Workflow className="w-4 h-4 mr-2 text-gray-400" />適用ワークフローと担当者</h3>
      {clientWfIds.map(wfId => {
        const wf = getWorkflow(wfId);
        return (
          <div key={wfId} className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-900">{wf.name}</span>
                <Badge className={categoryColor(wf.category)}>{wf.category}</Badge>
              </div>
              <span className="text-xs text-gray-400">{wf.steps.length}ステップ</span>
            </div>
            <div className="divide-y divide-gray-50">
              {wf.steps.map(step => {
                const asgn = clientAssignments.find(a => a.workflowId === wfId && a.stepId === step.id);
                const member = asgn ? getMember(asgn.memberId) : null;
                const task = taskInstances.find(t => t.clientId === clientId && t.stepId === step.id);
                return (
                  <div key={step.id} className="px-4 py-2.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs w-5">#{step.order}</span>
                      <span className="text-gray-800">{step.name}</span>
                      <span className="text-[10px] text-gray-400">〜{step.dueDay}日</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {task && <Badge className={statusColor(task.status)}><StatusIcon status={task.status} />{statusLabel(task.status)}</Badge>}
                      {member && (
                        <span className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                          <User className="w-3 h-3 mr-1 text-gray-400" />{member.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- メンバー管理 ----------
function MembersView({ onSelectMember, selectedMemberId }) {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">メンバー管理</h1>
        <p className="text-sm text-gray-500 mt-1">担当者ごとの担当顧客・タスク割当の管理</p>
      </div>
      <div className="space-y-3">
        {members.map(member => {
          const memberAssignments = assignments.filter(a => a.memberId === member.id);
          const memberClients = [...new Set(memberAssignments.map(a => a.clientId))];
          const tasks = taskInstances.filter(t => t.memberId === member.id);
          const inProgress = tasks.filter(t => t.status === 'in-progress').length;
          const todo = tasks.filter(t => t.status === 'todo').length;
          return (
            <div key={member.id} onClick={() => onSelectMember(member.id)}
              className={`bg-white rounded-xl p-4 sm:p-5 cursor-pointer transition-all border ${selectedMemberId === member.id ? 'border-indigo-500 shadow-md ring-2 ring-indigo-50' : 'border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md'}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-base text-gray-900">{member.name}</h3>
                  <Badge className="bg-gray-100 text-gray-600 mt-1">{member.role}</Badge>
                </div>
                <span className="text-xs text-gray-400">上限 {member.capacity}社</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2 mb-3">
                {member.skills.map(s => <Badge key={s} className="bg-indigo-50 text-indigo-600">{s}</Badge>)}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center"><Building2 className="w-3.5 h-3.5 mr-1 text-gray-400" />担当: {memberClients.length}社</span>
                <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-blue-400" />進行中: {inProgress}</span>
                <span className="flex items-center"><Circle className="w-3.5 h-3.5 mr-1 text-gray-300" />未着手: {todo}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MemberDetail({ memberId }) {
  const member = getMember(memberId);
  if (!member) return <EmptyDetail message="メンバーを選択してください" />;
  const memberAssignments = assignments.filter(a => a.memberId === memberId);
  const memberClientIds = [...new Set(memberAssignments.map(a => a.clientId))];

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
      <h2 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h2>
      <Badge className="bg-gray-100 text-gray-600">{member.role}</Badge>

      <div className="mt-4 mb-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">スキル</h3>
        <div className="flex flex-wrap gap-1.5">
          {member.skills.map(s => <Badge key={s} className="bg-indigo-50 text-indigo-600">{s}</Badge>)}
        </div>
      </div>

      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center"><Building2 className="w-4 h-4 mr-2 text-gray-400" />担当顧客別タスク</h3>
      {memberClientIds.map(cId => {
        const client = getClient(cId);
        const tasks = taskInstances.filter(t => t.memberId === memberId && t.clientId === cId);
        return (
          <div key={cId} className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <span className="font-semibold text-sm text-gray-900">{client.name}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {tasks.map(task => (
                <div key={task.id} className="px-4 py-2.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-800">{task.stepName}</span>
                    <span className="text-[10px] text-gray-400">{task.workflowName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColor(task.status)}><StatusIcon status={task.status} />{statusLabel(task.status)}</Badge>
                    <span className="text-xs text-gray-400">{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- ワークフロー ----------
function WorkflowsView({ onSelectWorkflow, selectedWorkflowId }) {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">ワークフロー</h1>
          <p className="text-sm text-gray-500 mt-1">月次BPO業務のテンプレート定義</p>
        </div>
        <button className="hidden sm:flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors"><Plus className="w-4 h-4" /><span>WF追加</span></button>
      </div>
      <div className="space-y-3">
        {workflows.map(wf => {
          const usedBy = [...new Set(assignments.filter(a => a.workflowId === wf.id).map(a => a.clientId))];
          return (
            <div key={wf.id} onClick={() => onSelectWorkflow(wf.id)}
              className={`bg-white rounded-xl p-4 sm:p-5 cursor-pointer transition-all border ${selectedWorkflowId === wf.id ? 'border-indigo-500 shadow-md ring-2 ring-indigo-50' : 'border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-gray-900">{wf.name}</h3>
                  <Badge className={categoryColor(wf.category)}>{wf.category}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 mb-3">
                {wf.steps.map((step, i) => (
                  <React.Fragment key={step.id}>
                    <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100 truncate max-w-[120px]">{step.name}</span>
                    {i < wf.steps.length - 1 && <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center"><Building2 className="w-3.5 h-3.5 mr-1 text-gray-400" />適用: {usedBy.length}社</span>
                <span className="flex items-center"><CheckSquare className="w-3.5 h-3.5 mr-1 text-gray-400" />{wf.steps.length}ステップ</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WorkflowDetail({ workflowId }) {
  const wf = getWorkflow(workflowId);
  if (!wf) return <EmptyDetail message="ワークフローを選択してください" />;
  const usedByClientIds = [...new Set(assignments.filter(a => a.workflowId === workflowId).map(a => a.clientId))];

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-bold text-gray-900">{wf.name}</h2>
        <Badge className={categoryColor(wf.category)}>{wf.category}</Badge>
      </div>
      <p className="text-sm text-gray-500 mb-6">毎月繰り返し実行されるBPO業務テンプレート</p>

      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-gray-400" />ステップ定義</h3>
      <div className="space-y-2 mb-6">
        {wf.steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>{step.order}</div>
            <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{step.name}</span>
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-50 text-indigo-600"><Tag className="w-3 h-3 mr-1" />{step.skillRequired}</Badge>
                  <span className="text-xs text-gray-400">毎月{step.dueDay}日まで</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center"><Link2 className="w-4 h-4 mr-2 text-gray-400" />適用中の顧客</h3>
      <div className="space-y-2">
        {usedByClientIds.map(cId => {
          const client = getClient(cId);
          const stepAssignments = assignments.filter(a => a.clientId === cId && a.workflowId === workflowId);
          const memberNames = [...new Set(stepAssignments.map(a => getMember(a.memberId)?.name))];
          return (
            <div key={cId} className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{client.name}</span>
              <span className="text-xs text-gray-500">{memberNames.join('、')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- タスク実行 ----------
function TasksView({ onSelectTask, selectedTaskId, filterClientId, setFilterClientId }) {
  const filtered = filterClientId ? taskInstances.filter(t => t.clientId === filterClientId) : taskInstances;
  const grouped = {};
  filtered.forEach(t => {
    const key = `${t.clientId}_${t.workflowId}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">タスク実行</h1>
          <p className="text-sm text-gray-500 mt-1">2026年4月 — 顧客×ワークフロー別の実行状況</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilterClientId(null)} className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${!filterClientId ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>すべて</button>
        {clients.map(c => (
          <button key={c.id} onClick={() => setFilterClientId(c.id)} className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${filterClientId === c.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}>{c.name.split('（')[0]}</button>
        ))}
      </div>

      {Object.entries(grouped).map(([key, tasks]) => {
        const client = getClient(tasks[0].clientId);
        const wf = getWorkflow(tasks[0].workflowId);
        return (
          <div key={key} className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-900">{client.name.split('（')[0]}</span>
                <ArrowRight className="w-3 h-3 text-gray-300" />
                <span className="text-sm text-gray-600">{wf.name}</span>
                <Badge className={categoryColor(wf.category)}>{wf.category}</Badge>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {tasks.sort((a, b) => {
                const sa = wf.steps.find(s => s.id === a.stepId);
                const sb = wf.steps.find(s => s.id === b.stepId);
                return sa.order - sb.order;
              }).map(task => {
                const member = getMember(task.memberId);
                return (
                  <div key={task.id} onClick={() => onSelectTask(task.id)}
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${selectedTaskId === task.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColor(task.status)}><StatusIcon status={task.status} />{statusLabel(task.status)}</Badge>
                      <span className="text-sm text-gray-800">{task.stepName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 flex items-center"><User className="w-3 h-3 mr-1" />{member.name}</span>
                      <span className="text-xs text-gray-400">{task.dueDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskDetail({ taskId }) {
  const task = taskInstances.find(t => t.id === taskId);
  if (!task) return <EmptyDetail message="タスクを選択してください" />;
  const client = getClient(task.clientId);
  const member = getMember(task.memberId);
  const wf = getWorkflow(task.workflowId);
  const step = wf.steps.find(s => s.id === task.stepId);

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
      <h2 className="text-xl font-bold text-gray-900 mb-1">{task.stepName}</h2>
      <Badge className={statusColor(task.status)}><StatusIcon status={task.status} />{statusLabel(task.status)}</Badge>

      <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 mt-6 mb-6">
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><Building2 className="w-4 h-4 mr-2 opacity-70" />顧客</div><span className="text-sm font-medium text-gray-900">{client.name}</span></div>
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><Workflow className="w-4 h-4 mr-2 opacity-70" />ワークフロー</div><span className="text-sm font-medium text-gray-900">{wf.name}</span></div>
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><User className="w-4 h-4 mr-2 opacity-70" />担当者</div><span className="text-sm font-medium text-gray-900">{member.name}（{member.role}）</span></div>
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><Calendar className="w-4 h-4 mr-2 opacity-70" />期日</div><span className="text-sm font-medium text-gray-900">{task.dueDate}</span></div>
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><Tag className="w-4 h-4 mr-2 opacity-70" />必要スキル</div><Badge className="bg-indigo-50 text-indigo-600">{step.skillRequired}</Badge></div>
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><Calendar className="w-4 h-4 mr-2 opacity-70" />対象月</div><span className="text-sm font-medium text-gray-900">{task.month}</span></div>
      </div>

      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center"><Link2 className="w-4 h-4 mr-2 text-gray-400" />関連情報</h3>
      <div className="space-y-2 text-sm">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
          <span className="text-gray-700">同顧客の他タスク</span>
          <span className="text-xs text-indigo-600 font-medium">{taskInstances.filter(t => t.clientId === task.clientId && t.id !== task.id).length}件</span>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
          <span className="text-gray-700">同担当者の他タスク</span>
          <span className="text-xs text-indigo-600 font-medium">{taskInstances.filter(t => t.memberId === task.memberId && t.id !== task.id).length}件</span>
        </div>
      </div>
    </div>
  );
}

// ---------- 共通 ----------
function EmptyDetail({ message }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4"><MessageSquare className="w-8 h-8 text-gray-300" /></div>
      <p className="font-medium text-gray-500">{message}</p>
    </div>
  );
}

function DetailHeader({ onClose }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0 bg-white">
      <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Details</span>
      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md lg:hidden transition-colors" onClick={onClose}><X className="w-5 h-5" /></button>
    </div>
  );
}

// ===== メインApp =====

const MIN_DETAIL_WIDTH = 320;
const MAX_DETAIL_WIDTH = 700;
const DEFAULT_DETAIL_WIDTH = 480;

export default function App() {
  const [view, setView] = useState('tasks');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filterClientId, setFilterClientId] = useState(null);
  const [detailWidth, setDetailWidth] = useState(DEFAULT_DETAIL_WIDTH);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const startWidth = React.useRef(0);

  React.useEffect(() => {
    const handleMouseMove = (e) => { if (!isDragging.current) return; setDetailWidth(Math.min(MAX_DETAIL_WIDTH, Math.max(MIN_DETAIL_WIDTH, startWidth.current + (startX.current - e.clientX)))); };
    const handleMouseUp = () => { isDragging.current = false; document.body.style.cursor = ''; document.body.style.userSelect = ''; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, []);

  const handleMouseDown = (e) => { isDragging.current = true; startX.current = e.clientX; startWidth.current = detailWidth; document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; };

  const selectAndOpen = (setter) => (id) => { setter(id); setIsDetailOpen(true); };

  const renderMain = () => {
    switch (view) {
      case 'clients': return <ClientsView onSelectClient={selectAndOpen(setSelectedClientId)} selectedClientId={selectedClientId} />;
      case 'members': return <MembersView onSelectMember={selectAndOpen(setSelectedMemberId)} selectedMemberId={selectedMemberId} />;
      case 'workflows': return <WorkflowsView onSelectWorkflow={selectAndOpen(setSelectedWorkflowId)} selectedWorkflowId={selectedWorkflowId} />;
      case 'tasks': return <TasksView onSelectTask={selectAndOpen(setSelectedTaskId)} selectedTaskId={selectedTaskId} filterClientId={filterClientId} setFilterClientId={setFilterClientId} />;
      default: return null;
    }
  };

  const renderDetail = () => {
    switch (view) {
      case 'clients': return <ClientDetail clientId={selectedClientId} />;
      case 'members': return <MemberDetail memberId={selectedMemberId} />;
      case 'workflows': return <WorkflowDetail workflowId={selectedWorkflowId} />;
      case 'tasks': return <TaskDetail taskId={selectedTaskId} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
          <div className="flex items-center space-x-2"><div className="bg-indigo-600 text-white p-1 rounded-md"><CheckSquare className="w-5 h-5" /></div><span className="text-xl font-bold tracking-tight hidden sm:block text-gray-900">TaskChain</span></div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
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
            <NavItem icon={CheckSquare} label="タスク実行" active={view === 'tasks'} onClick={() => setView('tasks')} />
            <NavItem icon={Workflow} label="ワークフロー" active={view === 'workflows'} onClick={() => setView('workflows')} />
            <div className="pt-4 mt-2">
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">マスタ管理</p>
              <NavItem icon={Building2} label="顧客管理" active={view === 'clients'} onClick={() => setView('clients')} />
              <NavItem icon={Users2} label="メンバー管理" active={view === 'members'} onClick={() => setView('members')} />
            </div>
          </nav>
          <div className="p-3 border-t border-gray-100"><NavItem icon={Settings} label="設定" /></div>
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto bg-[#f8fafc] relative">{renderMain()}</main>

        {isDetailOpen && <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity" onClick={() => setIsDetailOpen(false)}></div>}
        <div onMouseDown={handleMouseDown} className="hidden lg:flex items-center justify-center w-2 cursor-col-resize bg-gray-100 hover:bg-indigo-200 active:bg-indigo-300 transition-colors shrink-0 group">
          <GripVertical className="w-3 h-3 text-gray-400 group-hover:text-indigo-500" />
        </div>
        <aside style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? detailWidth : undefined }}
          className={`fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col lg:translate-x-0 lg:static shadow-2xl lg:shadow-none shrink-0 ${isDetailOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <DetailHeader onClose={() => setIsDetailOpen(false)} />
          {renderDetail()}
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar{width:6px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background-color:#e2e8f0;border-radius:10px}.custom-scrollbar:hover::-webkit-scrollbar-thumb{background-color:#cbd5e1}`}} />
    </div>
  );
}
