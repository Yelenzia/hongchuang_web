const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const sanitizeUrl = (value) => {
    const trimmed = (value || '').trim();
    if (!trimmed)
        return '';
    if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('/uploads/') || trimmed.startsWith('/')) {
        return trimmed;
    }
    return '';
};
const KEYWORDS = /\b(public|private|protected|class|interface|enum|extends|implements|static|final|void|new|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|throws|import|package|const|let|var|function|export|default|from|async|await|true|false|null|undefined)\b/g;
const highlightCode = (source) => {
    let html = escapeHtml(source);
    html = html.replace(/(\/\/.*)$/gm, '<span class="token comment">$1</span>');
    html = html.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="token string">$1</span>');
    html = html.replace(KEYWORDS, '<span class="token keyword">$1</span>');
    return html;
};
const renderInline = (value) => {
    let html = escapeHtml(value);
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
        const safe = sanitizeUrl(url);
        return safe ? `<img src="${escapeHtml(safe)}" alt="${escapeHtml(alt || '')}" />` : '';
    });
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
        const safe = sanitizeUrl(url);
        return safe ? `<a href="${escapeHtml(safe)}" target="_blank" rel="noopener noreferrer">${text}</a>` : text;
    });
    return html;
};
export const renderMarkdown = (raw) => {
    const lines = (raw || '').replace(/\r/g, '').split('\n');
    const html = [];
    let inCode = false;
    let codeLang = '';
    const codeBuffer = [];
    let inTable = false;
    let tableBuffer = [];
    let inUl = false;
    let inOl = false;
    const closeLists = () => {
        if (inUl) {
            html.push('</ul>');
            inUl = false;
        }
        if (inOl) {
            html.push('</ol>');
            inOl = false;
        }
    };
    const flushCode = () => {
        if (!inCode)
            return;
        html.push(`<pre class="code-block"><div class="code-head">${escapeHtml(codeLang || 'code')}</div><code class="language-${escapeHtml(codeLang || 'plain')}">${highlightCode(codeBuffer.join('\n'))}</code></pre>`);
        inCode = false;
        codeLang = '';
        codeBuffer.length = 0;
    };
    const flushTable = () => {
        if (!inTable || tableBuffer.length === 0)
            return;
        const rows = tableBuffer.map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));
        if (rows.length >= 1) {
            const [head, ...body] = rows;
            html.push('<div class="table-wrap"><table><thead><tr>');
            head.forEach(cell => html.push(`<th>${renderInline(cell)}</th>`));
            html.push('</tr></thead><tbody>');
            const normalizedBody = body[0]?.every(cell => /^:?-{3,}:?$/.test(cell)) ? body.slice(1) : body;
            normalizedBody.forEach(row => {
                html.push('<tr>');
                row.forEach(cell => html.push(`<td>${renderInline(cell)}</td>`));
                html.push('</tr>');
            });
            html.push('</tbody></table></div>');
        }
        inTable = false;
        tableBuffer = [];
    };
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('```')) {
            flushTable();
            closeLists();
            if (inCode) {
                flushCode();
            }
            else {
                inCode = true;
                codeLang = trimmed.replace(/^```/, '').trim();
            }
            continue;
        }
        if (inCode) {
            codeBuffer.push(line);
            continue;
        }
        if (trimmed.includes('|') && /^\|?.+\|.+\|?$/.test(trimmed)) {
            closeLists();
            inTable = true;
            tableBuffer.push(trimmed);
            continue;
        }
        flushTable();
        if (!trimmed) {
            closeLists();
            html.push('<div class="md-gap"></div>');
            continue;
        }
        if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
            closeLists();
            html.push('<hr />');
            continue;
        }
        if (/^[-*]\s+/.test(trimmed)) {
            if (inOl) {
                html.push('</ol>');
                inOl = false;
            }
            if (!inUl) {
                html.push('<ul>');
                inUl = true;
            }
            html.push(`<li>${renderInline(trimmed.replace(/^[-*]\s+/, ''))}</li>`);
            continue;
        }
        if (/^\d+\.\s+/.test(trimmed)) {
            if (inUl) {
                html.push('</ul>');
                inUl = false;
            }
            if (!inOl) {
                html.push('<ol>');
                inOl = true;
            }
            html.push(`<li>${renderInline(trimmed.replace(/^\d+\.\s+/, ''))}</li>`);
            continue;
        }
        closeLists();
        if (/^###\s+/.test(trimmed)) {
            html.push(`<h3>${renderInline(trimmed.replace(/^###\s+/, ''))}</h3>`);
        }
        else if (/^##\s+/.test(trimmed)) {
            html.push(`<h2>${renderInline(trimmed.replace(/^##\s+/, ''))}</h2>`);
        }
        else if (/^#\s+/.test(trimmed)) {
            html.push(`<h1>${renderInline(trimmed.replace(/^#\s+/, ''))}</h1>`);
        }
        else if (/^>\s+/.test(trimmed)) {
            html.push(`<blockquote>${renderInline(trimmed.replace(/^>\s+/, ''))}</blockquote>`);
        }
        else {
            html.push(`<p>${renderInline(trimmed)}</p>`);
        }
    }
    flushCode();
    flushTable();
    closeLists();
    return html.join('');
};
//# sourceMappingURL=markdown.js.map