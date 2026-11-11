import { useEffect, useMemo, useRef, useState } from "react";

const A = "/assets";

type Appointment = {
  name: string;
  breed: string;
  service: string;
  avatar: string;
  icon: string;
};

type Section = {
  label: string;
  icon: string;
  title: string;
  description: string;
  action: string;
  stats: { value: string; label: string }[];
  entries: { title: string; meta: string; status: string }[];
};

const actionDetails = [
  null,
  {
    description: "Marque um novo horário para um cliente e seu pet.",
    fields: ["Nome do cliente ou pet", "Data e horário"],
  },
  {
    description: "Crie o registro clínico inicial de um paciente.",
    fields: ["Nome do pet", "Motivo do atendimento"],
  },
  {
    description: "Anote o consumo de ração para acompanhar a alimentação do pet.",
    fields: ["Nome do pet", "Quantidade consumida"],
  },
  {
    description: "Inclua um novo item no catálogo da loja.",
    fields: ["Nome do produto", "Quantidade inicial"],
  },
  {
    description: "Cadastre um responsável e vincule o seu pet.",
    fields: ["Nome do responsável", "Nome do pet"],
  },
] as const;

const navItems = [
  {
    label: "Painel de Controle",
    icon: "ded71.png",
    title: "Visão geral da clínica",
    description: "Acompanhe os principais indicadores do dia.",
    action: "Ver resumo",
    stats: [],
    entries: [],
  },
  {
    label: "Agenda inteligente",
    icon: "55f54.png",
    title: "Organize a rotina sem conflitos",
    description: "Visualize consultas, banhos e retornos em um só lugar.",
    action: "Novo agendamento",
    stats: [
      { value: "8", label: "Atendimentos hoje" },
      { value: "3", label: "Horários disponíveis" },
      { value: "2", label: "Retornos pendentes" },
    ],
    entries: [
      { title: "Thor — Tosa geral", meta: "Hoje, 09:30 · Sala 2", status: "Confirmado" },
      { title: "Romeu — Consulta geral", meta: "Hoje, 11:00 · Dra. Alicia", status: "A caminho" },
      { title: "Luna — Banho e tosa", meta: "Hoje, 14:30 · Estética", status: "Confirmado" },
    ],
  },
  {
    label: "Prontuário Digital",
    icon: "37012.png",
    title: "Histórico clínico sempre acessível",
    description: "Consulte vacinas, exames e anotações dos pacientes.",
    action: "Abrir prontuário",
    stats: [
      { value: "124", label: "Prontuários ativos" },
      { value: "7", label: "Vacinas próximas" },
      { value: "4", label: "Exames recentes" },
    ],
    entries: [
      { title: "Thor", meta: "Vacina anual atualizada ontem", status: "Atualizado" },
      { title: "Romeu", meta: "Resultado de hemograma disponível", status: "Novo exame" },
      { title: "Luna", meta: "Retorno recomendado em 15 dias", status: "Acompanhar" },
    ],
  },
  {
    label: "Ração e Consumo",
    icon: "f7111.png",
    title: "Cuidados com a alimentação",
    description: "Antecipe reposições e acompanhe o consumo de cada pet.",
    action: "Registrar consumo",
    stats: [
      { value: "3", label: "Alertas de reposição" },
      { value: "18", label: "Planos alimentares" },
      { value: "92%", label: "Rotinas em dia" },
    ],
    entries: [
      { title: "Thor", meta: "Ração termina em aproximadamente 3 dias", status: "Repor" },
      { title: "Bela", meta: "Consumo médio de 280 g por dia", status: "Atenção" },
      { title: "Romeu", meta: "Plano alimentar atualizado esta semana", status: "Em dia" },
    ],
  },
  {
    label: "Loja de Produtos Pet",
    icon: "79c79.png",
    title: "Produtos e pedidos da loja",
    description: "Acompanhe estoque, vendas e itens mais procurados.",
    action: "Novo produto",
    stats: [
      { value: "86", label: "Produtos ativos" },
      { value: "5", label: "Estoque baixo" },
      { value: "12", label: "Pedidos do dia" },
    ],
    entries: [
      {
        title: "Ração Premium 10 kg",
        meta: "Restam 4 unidades no estoque",
        status: "Estoque baixo",
      },
      {
        title: "Kit higiene para cães",
        meta: "8 unidades vendidas esta semana",
        status: "Em alta",
      },
      {
        title: "Areia higiênica 4 kg",
        meta: "Reposição prevista para amanhã",
        status: "A caminho",
      },
    ],
  },
  {
    label: "Clientes & Pets",
    icon: "bf281.png",
    title: "Relacionamento em um só lugar",
    description: "Encontre responsáveis, pacientes e informações de contato.",
    action: "Novo cadastro",
    stats: [
      { value: "98", label: "Clientes ativos" },
      { value: "124", label: "Pets cadastrados" },
      { value: "6", label: "Aniversários no mês" },
    ],
    entries: [
      { title: "Alicia Souza · Thor", meta: "Contato atualizado há 2 dias", status: "Ativo" },
      { title: "Marcos Lima · Romeu", meta: "Próxima consulta hoje às 11:00", status: "Agendado" },
      { title: "Carla Mendes · Luna", meta: "Cliente desde abril de 2022", status: "Fidelizado" },
    ],
  },
] satisfies Section[];

const appointments: Appointment[] = [
  {
    name: "Thor",
    breed: "Golden Retriver",
    service: "Tosa Geral",
    avatar: "a930b.png",
    icon: "51b46.png",
  },
  {
    name: "Romeu",
    breed: "Gato persa",
    service: "Consulta Geral",
    avatar: "4c339.png",
    icon: "3eda1.png",
  },
  {
    name: "Luna",
    breed: "Poodle",
    service: "Banho e tosa",
    avatar: "2134b.png",
    icon: "51b46.png",
  },
  {
    name: "Max",
    breed: "Beagle",
    service: "Vacinação",
    avatar:
      "https://images.unsplash.com/photo-1532753876631-2d5cf129df39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxkb2clMjBjYXQlMjBwZXQlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzk0NDIwMjU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: "3eda1.png",
  },
  {
    name: "Mel",
    breed: "Gata tigrada",
    service: "Consulta de retorno",
    avatar:
      "https://images.unsplash.com/photo-1628259679263-d1d5e245b778?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxkb2clMjBjYXQlMjBwZXQlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzk0NDIwMjU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: "3eda1.png",
  },
  {
    name: "Nina",
    breed: "Border Collie",
    service: "Avaliação geral",
    avatar:
      "https://images.unsplash.com/photo-1550953581-a75aa86fec20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxkb2clMjBjYXQlMjBwZXQlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzk0NDIwMjU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: "51b46.png",
  },
];

const weeklyAvailability = [
  { day: "Seg", value: 66 },
  { day: "Ter", value: 82 },
  { day: "Qua", value: 42 },
  { day: "Qui", value: 72 },
  { day: "Sex", value: 34 },
  { day: "Sáb", value: 88 },
];

function Asset({
  name,
  alt = "",
  className = "",
}: {
  name: string;
  alt?: string;
  className?: string;
}) {
  return <img src={`${A}/${name}`} alt={alt} className={className} />;
}

function NavIcon({ name }: { name: string }) {
  const source = `url("${A}/${name}")`;

  return (
    <span
      className="nav-icon"
      aria-hidden="true"
      style={{ maskImage: source, WebkitMaskImage: source }}
    />
  );
}

function App() {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [notice, setNotice] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [actionModal, setActionModal] = useState<number | null>(null);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const noticeTimer = useRef<number | undefined>(undefined);
  const activeSection = navItems[active];

  const filteredAppointments = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    if (!term) return appointments;
    return appointments.filter((item) =>
      `${item.name} ${item.breed} ${item.service}`.toLocaleLowerCase("pt-BR").includes(term),
    );
  }, [query]);

  const filteredEntries = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    if (!term) return activeSection.entries;
    return activeSection.entries.filter((entry) =>
      `${entry.title} ${entry.meta} ${entry.status}`.toLocaleLowerCase("pt-BR").includes(term),
    );
  }, [activeSection, query]);

  const showNotice = (message: string, duration = 2200) => {
    window.clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = window.setTimeout(() => setNotice(""), duration);
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setQuickActionsOpen(false);
        setActionModal(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.clearTimeout(noticeTimer.current);
    };
  }, []);

  const selectSection = (index: number) => {
    setActive(index);
    setQuery("");
    setMobileOpen(false);
    setQuickActionsOpen(false);
    showNotice(`${navItems[index].label} aberto`);
  };

  const openAction = (index: number) => {
    setQuickActionsOpen(false);
    setActionModal(index);
  };

  const finishAction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (actionModal === null) return;
    const action = navItems[actionModal].action;
    setActionModal(null);
    showNotice(`${action} salvo com sucesso!`, 2600);
  };

  const sendNotifications = () => {
    selectSection(3);
    showNotice("Escolha os pets para enviar as notificações", 2600);
  };

  return (
    <div className={`${dark ? "app dark" : "app"}${active === 0 ? "" : " section-mode"}`}>
      {active === 0 && (
        <>
          <button
            className="mobile-menu"
            type="button"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            aria-controls="main-navigation"
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>

          <aside className={mobileOpen ? "sidebar open" : "sidebar"} aria-label="Menu lateral">
            <div>
              <h1>Pet Life</h1>
              <nav id="main-navigation" aria-label="Navegação principal">
                {navItems.map(({ label, icon }, index) => (
                  <button
                    key={label}
                    type="button"
                    className={active === index ? "nav-item active" : "nav-item"}
                    onClick={() => selectSection(index)}
                    aria-current={active === index ? "page" : undefined}
                  >
                    <NavIcon name={icon} />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="profile-card">
              <div className="person">
                <Asset name="af1bb.png" alt="Alicia Souza" />
                <span>
                  <strong>Alicia Souza</strong>
                  <small>Veterinaria</small>
                </span>
              </div>
              <div className="person">
                <Asset name="33b60.png" alt="Romeu" />
                <span>
                  <strong>Romeu</strong>
                  <small>Paciente</small>
                </span>
              </div>
              <button type="button" onClick={() => showNotice("Configurações abertas")}>
                <Asset name="eb66a.png" alt="" />
                Configurações
              </button>
              <button type="button" onClick={() => showNotice("Central de suporte aberta")}>
                <Asset name="f41fa.png" alt="" />
                Suporte Pet
              </button>
            </div>
          </aside>
        </>
      )}

      <main>
        <header className={active === 0 ? "topbar dashboard-topbar" : "topbar"}>
          {active !== 0 && (
            <nav className="page-location" aria-label="Localização atual">
              <button type="button" onClick={() => selectSection(0)}>
                Painel
              </button>
              <span className="location-separator" aria-hidden="true">
                /
              </span>
              <span aria-current="page">{activeSection.label}</span>
            </nav>
          )}
          <label className="search">
            <Asset name="fa78e.png" alt="" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={active === 0 ? "Pesquisar pacientes" : "Pesquisar nesta área"}
              aria-label={
                active === 0 ? "Pesquisar pacientes" : `Pesquisar em ${activeSection.label}`
              }
            />
            {query && (
              <button
                type="button"
                className="clear-search"
                aria-label="Limpar pesquisa"
                onClick={() => setQuery("")}
              >
                ×
              </button>
            )}
          </label>
          <div className="context-action">
            <button
              type="button"
              className="context-action-button"
              aria-expanded={active === 0 ? quickActionsOpen : undefined}
              aria-haspopup={active === 0 ? "menu" : undefined}
              onClick={() =>
                active === 0 ? setQuickActionsOpen((value) => !value) : openAction(active)
              }
            >
              <span aria-hidden="true">{active === 0 ? "≡" : "+"}</span>
              {active === 0 ? "Ações rápidas" : activeSection.action}
            </button>
            {active === 0 && quickActionsOpen && (
              <div className="quick-actions-menu" role="menu">
                <strong>O que você deseja fazer?</strong>
                {navItems.slice(1).map((item, index) => (
                  <button
                    type="button"
                    role="menuitem"
                    key={item.action}
                    onClick={() => openAction(index + 1)}
                  >
                    <NavIcon name={item.icon} />
                    <span>
                      <strong>{item.action}</strong>
                      <small>{item.label}</small>
                    </span>
                    <span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="header-actions">
            <button
              type="button"
              aria-label="Notificações, 3 novas"
              onClick={() => showNotice("Você tem 3 novas notificações")}
            >
              <Asset name="6cde6.png" alt="" />
              <span className="notification-dot" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Mensagens, 2 não lidas"
              onClick={() => showNotice("Você tem 2 mensagens não lidas")}
            >
              <Asset name="2a410.png" alt="" />
            </button>
            <button
              type="button"
              className={dark ? "theme-toggle on" : "theme-toggle"}
              aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
              aria-pressed={dark}
              onClick={() => setDark((value) => !value)}
            >
              <Asset name="e3b02.png" alt="" className="sun" />
              <Asset name="48348.png" alt="" className="moon" />
            </button>
          </div>
        </header>

        {active === 0 ? (
          <>
            <section
              className={welcomeVisible ? "hero welcome-visible" : "hero"}
              aria-label="Boas-vindas"
              tabIndex={0}
              onMouseEnter={() => setWelcomeVisible(true)}
              onFocus={() => setWelcomeVisible(true)}
            >
              <div className="welcome">
                <h2>Oi Alicia</h2>
                <p>
                  Você por aqui?
                  <br />
                  Tenha um ótimo dia.
                </p>
              </div>
              <Asset name="66918.png" alt="Um cachorro e um gato juntos" className="hero-pets" />
            </section>

            <section className="dashboard-grid" aria-label="Resumo do painel">
              <article className="availability card">
                <div className="availability-header">
                  <h2>Vagas de hoje</h2>
                  <p>3 de abril</p>
                </div>
                <div className="progress-block">
                  <div className="progress" role="img" aria-label="60% das vagas disponíveis">
                    <svg viewBox="0 0 180 180" aria-hidden="true">
                      <circle className="progress-track" cx="90" cy="90" r="72" pathLength="100" />
                      <circle
                        className="progress-value"
                        cx="90"
                        cy="90"
                        r="72"
                        pathLength="100"
                        transform="rotate(-90 90 90)"
                      />
                      <circle className="progress-dot" cx="48" cy="148" r="6" />
                    </svg>
                    <span className="progress-copy">
                      <strong>60%</strong>
                      <small>disponíveis</small>
                    </span>
                  </div>
                  <p className="availability-total">
                    <strong>12</strong> de 20 horários livres
                  </p>
                </div>
                <div className="weekly-chart">
                  <div className="chart-legend">
                    <span aria-hidden="true" />
                    Vagas disponíveis
                  </div>
                  <div className="chart-bars" role="img" aria-label="Disponibilidade da semana">
                    {weeklyAvailability.map(({ day, value }, index) => (
                      <div
                        className="chart-column"
                        key={day}
                        title={`${day}: ${value}% disponível`}
                      >
                        <div className="bar-track">
                          <span
                            style={{
                              height: `${value}%`,
                              animationDelay: `${index * 90}ms, ${900 + index * 120}ms`,
                            }}
                          />
                        </div>
                        <small>{day}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <div className="right-cards">
                <article className="schedule card">
                  <div className="schedule-heading">
                    <h2>Agenda do dia</h2>
                    <span>{filteredAppointments.length} pets</span>
                  </div>
                  <div className="appointments">
                    {filteredAppointments.length ? (
                      filteredAppointments.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          className="appointment"
                          onClick={() => showNotice(`${item.name}: ${item.service}`)}
                        >
                          <img
                            src={
                              item.avatar.startsWith("http") ? item.avatar : `${A}/${item.avatar}`
                            }
                            alt=""
                          />
                          <span>
                            <span className="pet-name">
                              <strong>{item.name}</strong> / {item.breed}
                            </span>
                            <span className="service">
                              <Asset name={item.icon} alt="" />
                              {item.service}
                            </span>
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="empty">Nenhum paciente encontrado.</p>
                    )}
                  </div>
                </article>

                <article className="food card">
                  <div className="food-copy">
                    <h2>Alimentação certa</h2>
                    <ul>
                      <li>A ração do Thor acaba em 3 dias.</li>
                      <li>A ração da Bela acaba em 3 dias.</li>
                      <li>A ração do Romeu acaba em 3 dias.</li>
                    </ul>
                    <button type="button" onClick={sendNotifications}>
                      Enviar notificações
                    </button>
                  </div>
                  <Asset
                    name="pet-food.png"
                    alt="Potes com diferentes rações para pets"
                    className="food-image"
                  />
                </article>
              </div>
            </section>
          </>
        ) : (
          <section className="section-view" aria-labelledby="section-title">
            <div className="section-heading">
              <div className="section-heading-icon">
                <NavIcon name={activeSection.icon} />
              </div>
              <div>
                <span className="eyebrow">{activeSection.label}</span>
                <h2 id="section-title">{activeSection.title}</h2>
                <p>{activeSection.description}</p>
              </div>
            </div>

            <div className="stats-grid" aria-label={`Resumo de ${activeSection.label}`}>
              {activeSection.stats.map((stat) => (
                <article className="stat-card" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>

            <article className="activity-card">
              <div className="activity-heading">
                <div>
                  <span className="eyebrow">Atualizações</span>
                  <h3>Informações recentes</h3>
                </div>
                <span>{filteredEntries.length} registros</span>
              </div>
              <div className="activity-list">
                {filteredEntries.length ? (
                  filteredEntries.map((entry) => (
                    <button
                      type="button"
                      className="activity-row"
                      key={entry.title}
                      onClick={() => showNotice(`${entry.title} aberto`)}
                    >
                      <span className="activity-marker" aria-hidden="true" />
                      <span>
                        <strong>{entry.title}</strong>
                        <small>{entry.meta}</small>
                      </span>
                      <span className="status-pill">{entry.status}</span>
                      <span className="row-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="empty section-empty">Nenhum registro encontrado.</p>
                )}
              </div>
            </article>
          </section>
        )}
      </main>

      {notice && (
        <div className="toast" role="status" aria-live="polite">
          {notice}
        </div>
      )}
      {actionModal !== null && actionDetails[actionModal] && (
        <div className="modal-backdrop" onMouseDown={() => setActionModal(null)}>
          <section
            className="action-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Fechar"
              onClick={() => setActionModal(null)}
            >
              ×
            </button>
            <span className="modal-kicker">{navItems[actionModal].label}</span>
            <h2 id="action-modal-title">{navItems[actionModal].action}</h2>
            <p>{actionDetails[actionModal].description}</p>
            <form onSubmit={finishAction}>
              {actionDetails[actionModal].fields.map((field, index) => (
                <label key={field}>
                  <span>{field}</span>
                  <input
                    type={index === 1 && actionModal === 1 ? "datetime-local" : "text"}
                    placeholder={index === 1 && actionModal === 1 ? undefined : field}
                    required
                    autoFocus={index === 0}
                  />
                </label>
              ))}
              <div className="modal-actions">
                <button type="button" onClick={() => setActionModal(null)}>
                  Cancelar
                </button>
                <button type="submit">{navItems[actionModal].action}</button>
              </div>
            </form>
          </section>
        </div>
      )}
      {mobileOpen && (
        <button className="scrim" aria-label="Fechar menu" onClick={() => setMobileOpen(false)} />
      )}
    </div>
  );
}

export default App;
