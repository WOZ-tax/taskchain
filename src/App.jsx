import React, { useState } from 'react';
import {
  Menu, X, CheckCircle, Clock, Circle, User, Building2,
  Calendar, MessageSquare, Users2, ArrowRight,
  CheckSquare, Users, Settings, Workflow,
  Plus, GripVertical, Link2, Tag, Briefcase,
  ChevronDown, Shield, Eye, Lock
} from 'lucide-react';

// ===== マスタデータ =====

const clients = [
  { id: 'c1', name: 'A社（株式会社アルファ）', industry: '製造業', plan: '経理+労務', contractStart: '2024年4月', note: '従業員50名、月次訪問あり' },
  { id: 'c2', name: 'B社（ベータ合同会社）', industry: 'IT', plan: '経理のみ', contractStart: '2025年1月', note: '従業員12名、フルリモート対応' },
  { id: 'c3', name: 'C社（ガンマ株式会社）', industry: '飲食', plan: '経理+労務', contractStart: '2023年10月', note: '3店舗、従業員80名（パート含む）' },
  { id: 'c4', name: 'D社（デルタ産業）', industry: '建設', plan: '労務のみ', contractStart: '2025年6月', note: '従業員30名' },
  { id: 'c5', name: 'E社（イプシロンHD）', industry: '不動産', plan: '経理+労務', contractStart: '2024年9月', note: '子会社3社、連結あり' },
];

// チーム定義
const teams = [
  { id: 'team-keiri', name: '経理チーム', category: '経理', color: 'violet' },
  { id: 'team-roumu', name: '労務チーム', category: '労務', color: 'amber' },
];

const members = [
  { id: 'm1', name: '田中 美咲', role: '経理担当', teamId: 'team-keiri', isManager: false, skills: ['記帳', '月次決算', '請求書発行'], capacity: 5 },
  { id: 'm2', name: '佐藤 健一', role: '労務担当', teamId: 'team-roumu', isManager: false, skills: ['給与計算', '社会保険', '勤怠管理'], capacity: 4 },
  { id: 'm3', name: '鈴木 あゆみ', role: '経理担当', teamId: 'team-keiri', isManager: false, skills: ['記帳', '請求書発行', '月次決算'], capacity: 5 },
  { id: 'm4', name: '高橋 大輔', role: '労務担当', teamId: 'team-roumu', isManager: false, skills: ['給与計算', '入退社手続', '年末調整'], capacity: 3 },
  { id: 'm5', name: '渡辺 裕子', role: 'マネージャー', teamId: null, isManager: true, skills: ['月次レポート', '品質管理', 'クライアント対応'], capacity: 6 },
  { id: 'm6', name: '山本 真理', role: '経理担当', teamId: 'team-keiri', isManager: false, skills: ['記帳', '請求書発行'], capacity: 4 },
  { id: 'm7', name: '中村 拓也', role: '労務担当', teamId: 'team-roumu', isManager: false, skills: ['給与計算', '社会保険', '入退社手続'], capacity: 4 },
];

const workflows = [
  {
    id: 'wf1', name: '月次経理BPO', category: '経理', teamId: 'team-keiri',
    steps: [
      { id: 's1', name: '証憑回収・確認', order: 1, dueDay: 3, skillRequired: '記帳' },
      { id: 's2', name: '仕訳入力・記帳', order: 2, dueDay: 7, skillRequired: '記帳' },
      { id: 's3', name: '請求書発行・送付', order: 3, dueDay: 10, skillRequired: '請求書発行' },
      { id: 's4', name: '入金消込・売掛管理', order: 4, dueDay: 15, skillRequired: '記帳' },
      { id: 's5', name: '月次試算表作成・報告', order: 5, dueDay: 20, skillRequired: '月次決算' },
    ]
  },
  {
    id: 'wf2', name: '月次労務BPO', category: '労務', teamId: 'team-roumu',
    steps: [
      { id: 's6', name: '勤怠データ締め・確認', order: 1, dueDay: 5, skillRequired: '勤怠管理' },
      { id: 's7', name: '給与計算・明細作成', order: 2, dueDay: 10, skillRequired: '給与計算' },
      { id: 's8', name: '社会保険手続き', order: 3, dueDay: 15, skillRequired: '社会保険' },
      { id: 's9', name: '入退社手続き', order: 4, dueDay: 20, skillRequired: '入退社手続' },
    ]
  },
];

// 顧客×ワークフロー×担当者の割当
const assignments = [
  // A社: 経理+労務
  { clientId: 'c1', workflowId: 'wf1', stepId: 's1', memberId: 'm1' },
  { clientId: 'c1', workflowId: 'wf1', stepId: 's2', memberId: 'm1' },
  { clientId: 'c1', workflowId: 'wf1', stepId: 's3', memberId: 'm3' },
  { clientId: 'c1', workflowId: 'wf1', stepId: 's4', memberId: 'm1' },
  { clientId: 'c1', workflowId: 'wf1', stepId: 's5', memberId: 'm5' },
  { clientId: 'c1', workflowId: 'wf2', stepId: 's6', memberId: 'm2' },
  { clientId: 'c1', workflowId: 'wf2', stepId: 's7', memberId: 'm2' },
  { clientId: 'c1', workflowId: 'wf2', stepId: 's8', memberId: 'm4' },
  { clientId: 'c1', workflowId: 'wf2', stepId: 's9', memberId: 'm4' },
  // B社: 経理のみ
  { clientId: 'c2', workflowId: 'wf1', stepId: 's1', memberId: 'm3' },
  { clientId: 'c2', workflowId: 'wf1', stepId: 's2', memberId: 'm3' },
  { clientId: 'c2', workflowId: 'wf1', stepId: 's3', memberId: 'm6' },
  { clientId: 'c2', workflowId: 'wf1', stepId: 's4', memberId: 'm3' },
  { clientId: 'c2', workflowId: 'wf1', stepId: 's5', memberId: 'm5' },
  // C社: 経理+労務
  { clientId: 'c3', workflowId: 'wf1', stepId: 's1', memberId: 'm6' },
  { clientId: 'c3', workflowId: 'wf1', stepId: 's2', memberId: 'm6' },
  { clientId: 'c3', workflowId: 'wf1', stepId: 's3', memberId: 'm6' },
  { clientId: 'c3', workflowId: 'wf1', stepId: 's4', memberId: 'm1' },
  { clientId: 'c3', workflowId: 'wf1', stepId: 's5', memberId: 'm5' },
  { clientId: 'c3', workflowId: 'wf2', stepId: 's6', memberId: 'm7' },
  { clientId: 'c3', workflowId: 'wf2', stepId: 's7', memberId: 'm7' },
  { clientId: 'c3', workflowId: 'wf2', stepId: 's8', memberId: 'm2' },
  { clientId: 'c3', workflowId: 'wf2', stepId: 's9', memberId: 'm2' },
  // D社: 労務のみ
  { clientId: 'c4', workflowId: 'wf2', stepId: 's6', memberId: 'm4' },
  { clientId: 'c4', workflowId: 'wf2', stepId: 's7', memberId: 'm4' },
  { clientId: 'c4', workflowId: 'wf2', stepId: 's8', memberId: 'm7' },
  { clientId: 'c4', workflowId: 'wf2', stepId: 's9', memberId: 'm7' },
  // E社: 経理+労務
  { clientId: 'c5', workflowId: 'wf1', stepId: 's1', memberId: 'm3' },
  { clientId: 'c5', workflowId: 'wf1', stepId: 's2', memberId: 'm3' },
  { clientId: 'c5', workflowId: 'wf1', stepId: 's3', memberId: 'm1' },
  { clientId: 'c5', workflowId: 'wf1', stepId: 's4', memberId: 'm1' },
  { clientId: 'c5', workflowId: 'wf1', stepId: 's5', memberId: 'm5' },
  { clientId: 'c5', workflowId: 'wf2', stepId: 's6', memberId: 'm2' },
  { clientId: 'c5', workflowId: 'wf2', stepId: 's7', memberId: 'm2' },
  { clientId: 'c5', workflowId: 'wf2', stepId: 's8', memberId: 'm4' },
  { clientId: 'c5', workflowId: 'wf2', stepId: 's9', memberId: 'm4' },
];

// 個社ごとのサブタスク定義（ステップ×顧客に紐づくチェックリスト）
const subtaskTemplates = {
  // 証憑回収: 顧客ごとに異なる
  's1_c1': [{ text: 'MFクラウド経費のCSVダウンロード', done: true }, { text: '通帳コピー回収（みずほ・三菱）', done: true }, { text: '請求書PDF回収（Dropbox共有フォルダ確認）', done: false }],
  's1_c2': [{ text: 'freee自動連携データ確認', done: true }, { text: 'Stripe売上明細ダウンロード', done: false }],
  's1_c3': [{ text: 'レジ締めデータ回収（3店舗分）', done: true }, { text: 'Uber Eats/出前館の売上明細', done: true }, { text: '仕入先請求書回収', done: false }, { text: '現金出納帳の確認', done: false }],
  // 仕訳入力
  's2_c1': [{ text: '売上仕訳入力', done: true }, { text: '仕入・経費仕訳入力', done: true }, { text: '振替伝票の確認', done: false }],
  's2_c2': [{ text: 'SaaS利用料の仕訳確認', done: true }, { text: '外注費の仕訳入力', done: false }],
  's2_c3': [{ text: '店舗別PL按分入力', done: false }, { text: '食材仕入の仕訳入力', done: false }, { text: 'アルバイト人件費計上', done: false }],
  // 給与計算
  's7_c1': [{ text: '固定残業超過分の計算', done: true }, { text: '通勤手当の変更確認', done: false }, { text: '住民税特別徴収額の反映', done: false }],
  's7_c3': [{ text: 'シフト表との突合', done: false }, { text: '深夜割増の計算（3店舗）', done: false }],
  's7_c4': [{ text: '現場手当の計算', done: false }, { text: '日雇い労働者の日報確認', done: false }],
  // 社会保険
  's8_c1': [{ text: '算定基礎届の準備', done: false }, { text: '月額変更届の該当者確認', done: false }],
  // 月次レポート
  's5_c1': [{ text: '部門別PL作成', done: false }, { text: '前年同月比コメント', done: false }, { text: '資金繰り予測更新', done: false }],
  's5_c5': [{ text: '連結消去仕訳の確認', done: false }, { text: '子会社3社の試算表統合', done: false }],
};

// タスクインスタンス生成
const taskInstances = assignments.map((a, i) => {
  const wf = workflows.find(w => w.id === a.workflowId);
  const step = wf.steps.find(s => s.id === a.stepId);
  const statuses = ['completed', 'completed', 'in-progress', 'todo', 'todo'];
  return {
    id: `t${i + 1}`,
    clientId: a.clientId,
    workflowId: a.workflowId,
    stepId: a.stepId,
    memberId: a.memberId,
    stepName: step.name,
    workflowName: wf.name,
    category: wf.category,
    teamId: wf.teamId,
    dueDate: `4月${step.dueDay}日`,
    status: statuses[Math.min(step.order - 1, 4)],
    month: '2026年4月',
  };
});

// ===== ヘルパー =====
const getClient = (id) => clients.find(c => c.id === id);
const getMember = (id) => members.find(m => m.id === id);
const getWorkflow = (id) => workflows.find(w => w.id === id);
const getTeam = (id) => teams.find(t => t.id === id);

const statusLabel = (s) => s === 'completed' ? '完了' : s === 'in-progress' ? '進行中' : '未着手';
const statusColor = (s) => s === 'completed' ? 'bg-emerald-100 text-emerald-700' : s === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600';
const StatusIcon = ({ status }) => status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1" /> : status === 'in-progress' ? <Clock className="w-3 h-3 mr-1" /> : <Circle className="w-3 h-3 mr-1" />;
const categoryColor = (c) => c === '経理' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700';

// ===== コンポーネント =====

const NavItem = ({ icon: Icon, label, active, onClick, indent, locked }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${indent ? 'pl-8' : ''} ${active ? 'bg-indigo-50 text-indigo-700' : locked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} disabled={locked}>
    <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : locked ? 'text-gray-300' : 'text-gray-400'}`} />
    <span className={`font-medium text-sm ${active ? 'font-semibold' : ''} flex-1 text-left`}>{label}</span>
    {locked && <Lock className="w-3.5 h-3.5 text-gray-300" />}
  </button>
);

const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md ${className}`}>{children}</span>
);

// ---------- 事業者切り替えメニュー ----------
function TenantSwitcher({ currentClient, onSwitch, isOpen, setIsOpen }) {
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 hover:border-indigo-200 transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
          <div className="text-left min-w-0">
            <div className="text-xs text-indigo-400 font-medium">事業者</div>
            <div className="text-sm font-bold text-indigo-900 truncate">{currentClient ? currentClient.name.split('（')[0] : 'すべて'}</div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
            <div className="p-2">
              <button onClick={() => { onSwitch(null); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${!currentClient ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                <Eye className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium">すべての事業者</div>
                  <div className="text-[11px] text-gray-400">マネージャービュー</div>
                </div>
              </button>
              <div className="my-1 border-t border-gray-100" />
              {clients.map(c => (
                <button key={c.id} onClick={() => { onSwitch(c.id); setIsOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${currentClient?.id === c.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{c.name.split('（')[0]}</div>
                    <div className="text-[11px] text-gray-400">{c.plan}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- ログインユーザー切り替え（デモ用） ----------
function UserSwitcher({ currentUser, onSwitch, isOpen, setIsOpen }) {
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">{currentUser.name[0]}</div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-medium text-gray-900">{currentUser.name}</div>
          <div className="text-[10px] text-gray-400 flex items-center gap-1">
            {currentUser.isManager ? <><Shield className="w-3 h-3" />マネージャー</> : getTeam(currentUser.teamId)?.name}
          </div>
        </div>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ログインユーザー切替（デモ）</span>
            </div>
            <div className="p-2">
              {members.map(m => (
                <button key={m.id} onClick={() => { onSwitch(m); setIsOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${currentUser.id === m.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{m.name[0]}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{m.name}</div>
                    <div className="text-[10px] text-gray-400">{m.isManager ? 'マネージャー（全チーム）' : `${getTeam(m.teamId)?.name} / ${m.role}`}</div>
                  </div>
                  {m.isManager && <Shield className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- 顧客管理 ----------
function ClientsView({ onSelectClient, selectedClientId, visibleClients }) {
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
        {visibleClients.map(client => {
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

function ClientDetail({ clientId, visibleTeamIds }) {
  const client = getClient(clientId);
  if (!client) return <EmptyDetail message="顧客を選択してください" />;
  const clientAssignments = assignments.filter(a => a.clientId === clientId);
  const clientWfIds = [...new Set(clientAssignments.map(a => a.workflowId))];
  const visibleWfIds = clientWfIds.filter(wfId => {
    const wf = getWorkflow(wfId);
    return visibleTeamIds.includes(wf.teamId);
  });

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
      {visibleWfIds.map(wfId => {
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
                      {member && <span className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md"><User className="w-3 h-3 mr-1 text-gray-400" />{member.name}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {clientWfIds.length > visibleWfIds.length && (
        <div className="text-xs text-gray-400 flex items-center gap-1 mt-2"><Lock className="w-3 h-3" />他チームのワークフローは非表示です</div>
      )}
    </div>
  );
}

// ---------- メンバー管理 ----------
function MembersView({ onSelectMember, selectedMemberId, visibleMembers }) {
  const grouped = {};
  visibleMembers.forEach(m => {
    const key = m.isManager ? 'manager' : m.teamId;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">メンバー管理</h1>
        <p className="text-sm text-gray-500 mt-1">担当者ごとの担当顧客・タスク割当の管理</p>
      </div>
      {Object.entries(grouped).map(([key, mems]) => {
        const team = key === 'manager' ? null : getTeam(key);
        return (
          <div key={key} className="mb-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              {key === 'manager' ? 'マネージャー' : team?.name}
            </h2>
            <div className="space-y-3">
              {mems.map(member => {
                const memberClients = [...new Set(assignments.filter(a => a.memberId === member.id).map(a => a.clientId))];
                const tasks = taskInstances.filter(t => t.memberId === member.id);
                const inProgress = tasks.filter(t => t.status === 'in-progress').length;
                const todo = tasks.filter(t => t.status === 'todo').length;
                return (
                  <div key={member.id} onClick={() => onSelectMember(member.id)}
                    className={`bg-white rounded-xl p-4 sm:p-5 cursor-pointer transition-all border ${selectedMemberId === member.id ? 'border-indigo-500 shadow-md ring-2 ring-indigo-50' : 'border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-gray-900">{member.name}</h3>
                        {member.isManager && <Shield className="w-4 h-4 text-indigo-400" />}
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
      })}
    </div>
  );
}

function MemberDetail({ memberId }) {
  const member = getMember(memberId);
  if (!member) return <EmptyDetail message="メンバーを選択してください" />;
  const memberClientIds = [...new Set(assignments.filter(a => a.memberId === memberId).map(a => a.clientId))];

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
        {member.isManager && <Shield className="w-5 h-5 text-indigo-400" />}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Badge className="bg-gray-100 text-gray-600">{member.role}</Badge>
        {member.teamId && <Badge className={member.teamId === 'team-keiri' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'}>{getTeam(member.teamId)?.name}</Badge>}
        {member.isManager && <Badge className="bg-indigo-100 text-indigo-700">全チーム横断</Badge>}
      </div>

      <div className="mb-6">
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
                    <Badge className={categoryColor(task.category)}>{task.category}</Badge>
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
function WorkflowsView({ onSelectWorkflow, selectedWorkflowId, visibleWorkflows }) {
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
        {visibleWorkflows.map(wf => {
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
              <div className="flex items-center gap-1 mt-3 mb-3 flex-wrap">
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
              <div className="flex items-center justify-between flex-wrap gap-2">
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
function TasksView({ onSelectTask, selectedTaskId, visibleTasks, currentClient }) {
  const grouped = {};
  visibleTasks.forEach(t => {
    const key = `${t.clientId}_${t.workflowId}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">タスク実行</h1>
        <p className="text-sm text-gray-500 mt-1">
          2026年4月 — {currentClient ? `${currentClient.name.split('（')[0]}のタスク` : '全事業者のタスク'}
        </p>
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">表示可能なタスクがありません</p>
          <p className="text-sm mt-1">事業者を切り替えてみてください</p>
        </div>
      )}

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
      <div className="flex items-center gap-2 mb-6">
        <Badge className={statusColor(task.status)}><StatusIcon status={task.status} />{statusLabel(task.status)}</Badge>
        <Badge className={categoryColor(task.category)}>{task.category}</Badge>
      </div>

      <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 mb-6">
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><Building2 className="w-4 h-4 mr-2 opacity-70" />顧客</div><span className="text-sm font-medium text-gray-900">{client.name}</span></div>
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><Workflow className="w-4 h-4 mr-2 opacity-70" />ワークフロー</div><span className="text-sm font-medium text-gray-900">{wf.name}</span></div>
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><User className="w-4 h-4 mr-2 opacity-70" />担当者</div><span className="text-sm font-medium text-gray-900">{member.name}（{member.role}）</span></div>
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><Calendar className="w-4 h-4 mr-2 opacity-70" />期日</div><span className="text-sm font-medium text-gray-900">{task.dueDate}</span></div>
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><Tag className="w-4 h-4 mr-2 opacity-70" />必要スキル</div><Badge className="bg-indigo-50 text-indigo-600">{step.skillRequired}</Badge></div>
        <div className="flex items-center"><div className="w-28 text-sm text-gray-500 flex items-center"><Calendar className="w-4 h-4 mr-2 opacity-70" />対象月</div><span className="text-sm font-medium text-gray-900">{task.month}</span></div>
      </div>

      {/* サブタスク（個社ごとのチェックリスト） */}
      {(() => {
        const key = `${task.stepId}_${task.clientId}`;
        const subs = subtaskTemplates[key];
        if (!subs) return null;
        const doneCount = subs.filter(s => s.done).length;
        return (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <CheckSquare className="w-4 h-4 mr-2 text-gray-400" />
              サブタスク
              <span className="ml-2 text-xs font-normal text-gray-400">{doneCount}/{subs.length}</span>
            </h3>
            <div className="space-y-2">
              {subs.map((sub, i) => (
                <label key={i} className="flex items-start space-x-3 p-3 bg-white border border-gray-100 shadow-sm rounded-lg cursor-pointer hover:border-indigo-300 transition-colors group">
                  <input type="checkbox" className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" defaultChecked={sub.done} />
                  <span className={`text-sm ${sub.done ? 'text-gray-400 line-through' : 'text-gray-700 group-hover:text-indigo-900'}`}>{sub.text}</span>
                </label>
              ))}
            </div>
            <button className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center"><Plus className="w-4 h-4 mr-1" /> サブタスクを追加</button>
          </div>
        );
      })()}

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
  const [currentUser, setCurrentUser] = useState(members[4]); // 渡辺（マネージャー）
  const [tenantClientId, setTenantClientId] = useState(null); // null=すべて
  const [tenantOpen, setTenantOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  // 権限ロジック: マネージャーは全チーム、メンバーは自チームのみ
  const visibleTeamIds = currentUser.isManager ? teams.map(t => t.id) : [currentUser.teamId];

  // 事業者フィルタ + チーム権限でフィルタリング
  const visibleTasks = taskInstances.filter(t => {
    if (tenantClientId && t.clientId !== tenantClientId) return false;
    return visibleTeamIds.includes(t.teamId);
  });

  const visibleWorkflows = workflows.filter(wf => visibleTeamIds.includes(wf.teamId));

  const visibleClients = tenantClientId
    ? clients.filter(c => c.id === tenantClientId)
    : clients.filter(c => {
        const clientTasks = taskInstances.filter(t => t.clientId === c.id && visibleTeamIds.includes(t.teamId));
        return clientTasks.length > 0;
      });

  const visibleMembers = currentUser.isManager
    ? members
    : members.filter(m => m.teamId === currentUser.teamId || m.isManager);

  const currentClient = tenantClientId ? getClient(tenantClientId) : null;

  const renderMain = () => {
    switch (view) {
      case 'clients': return <ClientsView onSelectClient={selectAndOpen(setSelectedClientId)} selectedClientId={selectedClientId} visibleClients={visibleClients} />;
      case 'members': return <MembersView onSelectMember={selectAndOpen(setSelectedMemberId)} selectedMemberId={selectedMemberId} visibleMembers={visibleMembers} />;
      case 'workflows': return <WorkflowsView onSelectWorkflow={selectAndOpen(setSelectedWorkflowId)} selectedWorkflowId={selectedWorkflowId} visibleWorkflows={visibleWorkflows} />;
      case 'tasks': return <TasksView onSelectTask={selectAndOpen(setSelectedTaskId)} selectedTaskId={selectedTaskId} visibleTasks={visibleTasks} currentClient={currentClient} />;
      default: return null;
    }
  };

  const renderDetail = () => {
    switch (view) {
      case 'clients': return <ClientDetail clientId={selectedClientId} visibleTeamIds={visibleTeamIds} />;
      case 'members': return <MemberDetail memberId={selectedMemberId} />;
      case 'workflows': return <WorkflowDetail workflowId={selectedWorkflowId} />;
      case 'tasks': return <TaskDetail taskId={selectedTaskId} />;
      default: return null;
    }
  };

  // ナビで他チームのWFは鍵マーク
  const keiriLocked = !visibleTeamIds.includes('team-keiri');
  const roumuLocked = !visibleTeamIds.includes('team-roumu');

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
          <div className="flex items-center space-x-2"><div className="bg-indigo-600 text-white p-1 rounded-md"><CheckSquare className="w-5 h-5" /></div><span className="text-xl font-bold tracking-tight hidden sm:block text-gray-900">TaskChain</span></div>
        </div>
        <div className="flex items-center space-x-2">
          {!currentUser.isManager && (
            <Badge className={currentUser.teamId === 'team-keiri' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'}>
              {getTeam(currentUser.teamId)?.name}
            </Badge>
          )}
          {currentUser.isManager && <Badge className="bg-indigo-100 text-indigo-700"><Shield className="w-3 h-3 mr-1" />全チーム</Badge>}
          <UserSwitcher currentUser={currentUser} onSwitch={setCurrentUser} isOpen={userMenuOpen} setIsOpen={setUserMenuOpen} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {isMobileMenuOpen && <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col shadow-2xl lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 lg:hidden border-b border-gray-100">
            <span className="font-bold text-lg text-gray-800 flex items-center"><CheckSquare className="w-5 h-5 text-indigo-600 mr-2" /> TaskChain</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-md"><X className="w-5 h-5" /></button>
          </div>

          {/* 事業者切り替え */}
          <div className="p-3 border-b border-gray-100">
            <TenantSwitcher currentClient={currentClient} onSwitch={setTenantClientId} isOpen={tenantOpen} setIsOpen={setTenantOpen} />
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <NavItem icon={CheckSquare} label="タスク実行" active={view === 'tasks'} onClick={() => setView('tasks')} />

            <div className="pt-4 mt-2">
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ワークフロー</p>
              <NavItem icon={Workflow} label="経理BPO" active={view === 'workflows' && selectedWorkflowId === 'wf1'} onClick={() => { if (!keiriLocked) { setView('workflows'); setSelectedWorkflowId('wf1'); setIsDetailOpen(true); }}} locked={keiriLocked} />
              <NavItem icon={Workflow} label="労務BPO" active={view === 'workflows' && selectedWorkflowId === 'wf2'} onClick={() => { if (!roumuLocked) { setView('workflows'); setSelectedWorkflowId('wf2'); setIsDetailOpen(true); }}} locked={roumuLocked} />
            </div>

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
