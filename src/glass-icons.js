(() => {
    const gradientMapping = {
        blue: "linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))",
        purple: "linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))",
        red: "linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))",
        indigo: "linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))",
        orange: "linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))",
        green: "linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))"
    };

    const svg = (content) => `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
            ${content}
        </svg>`;

    const icons = {
        java: svg('<path d="M9.2 16.8c-1.6 1.2-.9 2.2 1.2 2.2 3.8 0 7.1-1.3 8.6-2.9-1.4.8-3.8 1.3-6.3 1.3-1.2 0-2.5-.1-3.5-.6Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M13.2 5.2c1.4 1.2-1.5 2-1.5 3.1 0 .8.9 1.1 1.8 1.7 1.3.8 1.5 2.1.2 3.1-1.6 1.2-4.6.7-4.6-.9 0-.8.8-1.3 1.5-1.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M15.7 4.2c.6.8.3 1.3-.3 1.8M11 14.9c2 .4 4.5.2 6.1-.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
        python: svg('<path d="M12 3.5c-4.2 0-4.2 2.2-4.2 3.6v1.5h4.2v1H6.2C4.4 9.6 3.5 11 3.5 12.9s.9 3.5 2.7 3.5h1.6v-2.1c0-1.7 1-2.8 2.7-2.8h4.1c1.5 0 2.6-1.1 2.6-2.6V7.1c0-2.2-1.9-3.6-5.2-3.6Z" fill="currentColor" opacity=".95"/><path d="M12 20.5c4.2 0 4.2-2.2 4.2-3.6v-1.5H12v-1h5.8c1.8 0 2.7-1.4 2.7-3.3s-.9-3.5-2.7-3.5h-1.6v2.1c0 1.7-1 2.8-2.7 2.8H7.4c-1.5 0-2.6 1.1-2.6 2.6v1.8c0 2.2 1.9 3.6 5.2 3.6Z" fill="currentColor" opacity=".72"/><circle cx="10" cy="6.3" r=".8" fill="#fff"/><circle cx="14" cy="17.7" r=".8" fill="#fff"/>'),
        html: svg('<path d="m4 4 1.6 16L12 22l6.4-2L20 4H4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m7.2 7.4.5 5.7 4.3 1.2 4.3-1.2.5-5.7H7.2Zm.5 7.8.4 3.1 3.9 1.1 3.9-1.1.4-3.1" stroke="currentColor" stroke-width="1.4"/><path d="M8 9h8M8.4 12.2h7.2" stroke="currentColor" stroke-width="1.4"/>'),
        css: svg('<path d="M4 4h16l-1.4 15L12 21l-6.6-2L4 4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7.3 8.2h9.4M7.8 11.8h8.4M8.3 15.3h7.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
        javascript: svg('<path d="M4 4h16v16H4V4Z" fill="currentColor"/><path d="M13.1 17.3c.6.8 1.3 1.2 2.2 1.2.8 0 1.3-.4 1.3-.9 0-.6-.5-.8-1.4-1.2l-.5-.2c-1.4-.6-2.3-1.3-2.3-2.8 0-1.4 1.1-2.4 2.8-2.4 1.2 0 2.1.4 2.7 1.5l-1.5 1c-.3-.6-.7-.8-1.2-.8-.5 0-.9.3-.9.7 0 .5.3.7 1.2 1.1l.5.2c1.7.7 2.6 1.4 2.6 2.9 0 1.7-1.3 2.7-3.2 2.7-1.8 0-3-.9-3.6-2l1.3-1Z" fill="#fff"/><path d="M9.2 11.1H7.1v5.6c0 1.1-.3 1.4-1.1 1.4-.3 0-.7-.1-.9-.2l-.5 1.5c.5.3 1.1.4 1.7.4 1.8 0 2.9-.9 2.9-3.1v-5.6Z" fill="#fff"/>'),
        mysql: svg('<path d="M4 17.5c1.8-2.7 4.3-3.7 6.5-2.8 1.8.7 2.8 2.1 4.7 2.1 1.4 0 2.6-.5 4.1-1.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M5 10.5c2.3-2.4 5-3.1 7.2-1.7 1.5.9 2.3 2.1 4 2.1 1 0 2-.3 2.8-.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6.3 5.2c1.8-.9 3.7-.7 5.1.5 1.4 1.2 2.7 1.5 4.8.9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'),
        nosql: svg('<ellipse cx="12" cy="6" rx="6.5" ry="2.7" stroke="currentColor" stroke-width="1.6"/><path d="M5.5 6v6c0 1.5 2.9 2.7 6.5 2.7s6.5-1.2 6.5-2.7V6M5.5 12v6c0 1.5 2.9 2.7 6.5 2.7s6.5-1.2 6.5-2.7v-6" stroke="currentColor" stroke-width="1.6"/><path d="M8.2 9.5h7.6" stroke="currentColor" stroke-width="1.2" opacity=".7"/>'),
        github: svg('<path d="M12 3.5a8.5 8.5 0 0 0-2.7 16.6c.4.1.6-.2.6-.4v-1.7c-2.5.5-3-.9-3-.9-.4-.9-1-1.1-1-1.1-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2-.2-4.1-1-4.1-4.4 0-1 .4-1.8.9-2.4-.1-.2-.4-1.2.1-2.4 0 0 .8-.2 2.5.9a8.7 8.7 0 0 1 4.6 0c1.7-1.1 2.5-.9 2.5-.9.5 1.2.2 2.2.1 2.4.6.6.9 1.4.9 2.4 0 3.4-2.1 4.2-4.1 4.4.3.3.6.8.6 1.6v2.4c0 .2.2.5.6.4A8.5 8.5 0 0 0 12 3.5Z" fill="currentColor"/>'),
        csharp: svg('<path d="M7.2 7.2a5.8 5.8 0 1 0 0 9.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5.2 12h5.7M6.1 9.8l4.9 4.4M6.1 14.2l4.9-4.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M15 8v8M12.5 10.5h5M12.5 13.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'),
        vscode: svg('<path d="M17.8 3.8 12 9.1 7.2 5.4 4 7.2v9.6l3.2 1.8L12 14.9l5.8 5.3L20 18.4V5.6l-2.2-1.8Z" fill="currentColor" opacity=".95"/><path d="m4 7.2 5.1 4.8L4 16.8M17.8 3.8 12 9.1v5.8l5.8 5.3" fill="none" stroke="#fff" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>')
    };

    const items = [
        { icon: icons.java, color: "orange", label: "Java" },
        { icon: icons.python, color: "blue", label: "Python" },
        { icon: icons.html, color: "red", label: "HTML" },
        { icon: icons.css, color: "blue", label: "CSS" },
        { icon: icons.javascript, color: "orange", label: "JavaScript" },
        { icon: icons.mysql, color: "indigo", label: "MySQL" },
        { icon: icons.nosql, color: "green", label: "NoSQL" },
        { icon: icons.github, color: "purple", label: "GitHub" },
        { icon: icons.csharp, color: "purple", label: "C#" },
        { icon: icons.vscode, color: "blue", label: "VSCode" }
    ];

    const container = document.getElementById("skillsGlassIcons");
    if (!container) return;

    const getBackgroundStyle = color => ({
        background: gradientMapping[color] || color
    });

    items.forEach((item, index) => {
        const button = document.createElement("button");
        button.className = "icon-btn";
        button.type = "button";
        button.setAttribute("aria-label", item.label);
        button.dataset.index = index;

        const back = document.createElement("span");
        back.className = "icon-btn__back";
        Object.assign(back.style, getBackgroundStyle(item.color));

        const front = document.createElement("span");
        front.className = "icon-btn__front";

        const icon = document.createElement("span");
        icon.className = "icon-btn__icon";
        icon.innerHTML = item.icon;

        const label = document.createElement("span");
        label.className = "icon-btn__label";
        label.textContent = item.label;

        front.appendChild(icon);
        button.append(back, front, label);
        container.appendChild(button);
    });
})();
