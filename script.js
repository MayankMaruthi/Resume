'use strict';

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* Mobile nav */
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

function closeMobile() {
    if (!mobileNav) return;
    mobileNav.style.display = 'none';
    mobileNav.dataset.open = '0';
}

function toggleMobile() {
    if (!mobileNav) return;
    const open = mobileNav.dataset.open === '1';
    mobileNav.style.display = open ? 'none' : 'block';
    mobileNav.dataset.open = open ? '0' : '1';
}

navToggle?.addEventListener('click', toggleMobile);
mobileNav?.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) closeMobile();
});

/* Active nav link on scroll */
const sections = Array.from(document.querySelectorAll('section[id]'));
const links = Array.from(document.querySelectorAll('.links .link'));

function setActive(id) {
    links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
}

const obs = new IntersectionObserver((entries) => {
    const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(visible.target.id);
}, { threshold: [0.25, 0.5, 0.75] });

sections.forEach(s => obs.observe(s));

/* Toast */
const toastEl = document.getElementById('toast');
let toastT = null;

function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2200);
}

/* Project filter */
const filterBtns = Array.from(document.querySelectorAll('.f'));
const projectCards = Array.from(document.querySelectorAll('.p'));

function applyFilter(tag) {
    filterBtns.forEach(b => b.classList.toggle('is-on', b.dataset.filter === tag));
    projectCards.forEach(card => {
        const tags = String(card.dataset.tags || '');
        const show = tag === 'all' || tags.split(' ').includes(tag);
        card.style.display = show ? '' : 'none';
    });
}
filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

/* Project modal */
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalLink = document.getElementById('modalLink');
const modalBadge = document.getElementById('modalBadge');

function openModal({ title, desc, link, badge }) {
    if (!modal) return;
    modalTitle.textContent = title || 'Project';
    modalDesc.textContent = desc || '';
    modalBadge.textContent = badge || 'PR';
    modalLink.href = link || '#';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.dataset.title;
        const desc = card.dataset.desc;
        const link = card.dataset.link;
        const badge = card.querySelector('.p__badge')?.textContent?.trim() || 'PR';
        openModal({ title, desc, link, badge });
    });
});

modal?.addEventListener('click', (e) => {
    const close = e.target.closest('[data-close="1"]');
    if (close) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});