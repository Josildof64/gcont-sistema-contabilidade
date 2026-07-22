"use client";

import { useMemo, useState } from "react";

type Status = "Regular" | "Atenção" | "Pendente";

const companies = [
  { name: "Café Aurora ME", kind: "ME • Simples Nacional", status: "Regular" as Status, due: "DAS - 20 jul", action: "Comprovante recebido" },
  { name: "Ana Design SLU", kind: "SLU • Simples Nacional", status: "Atenção" as Status, due: "PGDAS-D - 20 jul", action: "Conferir receita de junho" },
  { name: "Oficina Horizonte", kind: "MEI • Serviços", status: "Pendente" as Status, due: "DASN-SIMEI", action: "Declaração anual em atraso" },
];

const tasks = [
  { company: "Ana Design SLU", title: "Enviar notas de serviço de junho", due: "Hoje", priority: "Alta" },
  { company: "Oficina Horizonte", title: "Entregar DASN-SIMEI", due: "Em atraso", priority: "Crítica" },
  { company: "Café Aurora ME", title: "Revisar certidão federal", due: "28 jul", priority: "Média" },
];

function statusClass(status: Status) {
  return status === "Regular" ? "ok" : status === "Atenção" ? "warning" : "pending";
}

export default function Home() {
  const [selected, setSelected] = useState("Todas as empresas");
  const [showForm, setShowForm] = useState(false);
  const filteredTasks = useMemo(
    () => selected === "Todas as empresas" ? tasks : tasks.filter((task) => task.company === selected),
    [selected]
  );

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand-gcont"><div className="gcont-logo"><img src="/gcont-logo.jpeg" alt="GCONT - Assessoria Contábil" /></div></div>
        <p className="workspace">GCONT - ASSESSORIA CONTÁBIL</p>
        <nav aria-label="Menu principal">
          <a className="nav-item active" href="#painel">Visão geral</a>
          <a className="nav-item" href="#empresas">Empresas</a>
          <a className="nav-item" href="#obrigacoes">Obrigações</a>
          <a className="nav-item" href="#documentos">Documentos</a>
          <a className="nav-item" href="#relatorios">Relatórios</a>
        </nav>
        <div className="side-help">Precisa de ajuda?<br /><strong>Fale com o suporte</strong></div>
      </aside>

      <section className="content" id="painel">
        <header className="topbar">
          <div>
            <p className="eyebrow">QUARTA-FEIRA, 22 DE JULHO</p>
            <h1>Bom dia, GCONT</h1>
            <p className="subtitle">Acompanhe a regularidade das empresas em um só lugar.</p>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notificações">🔔<i>3</i></button>
            <button className="avatar" aria-label="Abrir perfil">GC</button>
          </div>
        </header>

        <section className="focus-card">
          <div><p className="eyebrow">VISÃO DO DIA</p><h2>2 pendências precisam de atenção</h2><p>Conclua as tarefas de hoje para manter todas as empresas em dia.</p></div>
          <button className="primary" onClick={() => document.getElementById("obrigacoes")?.scrollIntoView({ behavior: "smooth" })}>Ver pendências</button>
        </section>

        <section className="metrics" aria-label="Resumo de regularidade">
          <article><span className="metric-icon green">✓</span><div><strong>1</strong><p>Empresa regular</p></div></article>
          <article><span className="metric-icon yellow">!</span><div><strong>1</strong><p>Requer atenção</p></div></article>
          <article><span className="metric-icon red">×</span><div><strong>1</strong><p>Com pendência</p></div></article>
          <article><span className="metric-icon blue">◷</span><div><strong>3</strong><p>Vencimentos próximos</p></div></article>
        </section>

        <section className="grid" id="empresas">
          <div className="panel companies-panel">
            <div className="panel-heading"><div><p className="eyebrow">CARTEIRA</p><h2>Empresas acompanhadas</h2></div><button className="text-button" onClick={() => setShowForm(true)}>+ Nova empresa</button></div>
            <div className="company-list">
              {companies.map((company) => <article className="company" key={company.name}>
                <div className="company-mark">{company.name.charAt(0)}</div>
                <div className="company-info"><h3>{company.name}</h3><p>{company.kind}</p></div>
                <div className="company-due"><span className={`status ${statusClass(company.status)}`}>{company.status}</span><p>{company.due}</p></div>
                <button className="more" aria-label={`Abrir ${company.name}`}>•••</button>
              </article>)}
            </div>
          </div>

          <div className="panel calendar-panel">
            <div className="panel-heading"><div><p className="eyebrow">JULHO</p><h2>Próximos prazos</h2></div><button className="text-button">Calendário</button></div>
            <div className="deadline"><b>20</b><div><strong>PGDAS-D e DAS</strong><p>Empresas do Simples Nacional</p></div></div>
            <div className="deadline"><b>28</b><div><strong>Certidão federal</strong><p>Café Aurora ME</p></div></div>
            <div className="deadline urgent"><b>31</b><div><strong>DASN-SIMEI</strong><p>Oficina Horizonte - em atraso</p></div></div>
          </div>
        </section>

        <section className="panel tasks-panel" id="obrigacoes">
          <div className="panel-heading"><div><p className="eyebrow">OPERAÇÃO</p><h2>Tarefas e obrigações</h2></div><select aria-label="Filtrar empresas" value={selected} onChange={(event) => setSelected(event.target.value)}><option>Todas as empresas</option>{companies.map((company) => <option key={company.name}>{company.name}</option>)}</select></div>
          <div className="task-table" role="table">
            <div className="table-head" role="row"><span>Empresa</span><span>Tarefa</span><span>Prazo</span><span>Prioridade</span></div>
            {filteredTasks.map((task) => <div className="task-row" role="row" key={task.title}><span className="task-company">{task.company}</span><span>{task.title}</span><span>{task.due}</span><span><em className={`priority ${task.priority.toLowerCase().replace("í", "i")}`}>{task.priority}</em></span></div>)}
          </div>
        </section>
      </section>

      {showForm && <div className="modal-backdrop" role="presentation"><form className="modal" onSubmit={(event) => { event.preventDefault(); setShowForm(false); }}><button type="button" className="close" onClick={() => setShowForm(false)} aria-label="Fechar">×</button><p className="eyebrow">CADASTRO INICIAL</p><h2>Nova empresa</h2><label>Razão social<input required placeholder="Ex.: Empresa Exemplo LTDA" /></label><label>CNPJ<input required placeholder="00.000.000/0001-00" /></label><label>Perfil<select defaultValue="ME"><option>MEI</option><option>ME</option><option>EPP</option></select></label><button className="primary" type="submit">Salvar empresa</button></form></div>}
    </main>
  );
}
