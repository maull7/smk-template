
        document.addEventListener('DOMContentLoaded', function () {
            const menuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');

            if (menuButton && mobileMenu) {
                const openIcon = menuButton.querySelector('[data-icon="menu"]');
                const closeIcon = menuButton.querySelector('[data-icon="close"]');

                const toggleMenu = (show) => {
                    menuButton.setAttribute('aria-expanded', String(show));
                    mobileMenu.classList.toggle('hidden', !show);

                    if (openIcon) {
                        openIcon.classList.toggle('hidden', show);
                    }

                    if (closeIcon) {
                        closeIcon.classList.toggle('hidden', !show);
                    }
                };

                menuButton.addEventListener('click', () => {
                    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
                    toggleMenu(!isExpanded);
                });

                mobileMenu.querySelectorAll('a, button').forEach((item) => {
                    item.addEventListener('click', () => {
                        if (window.innerWidth < 768) {
                            toggleMenu(false);
                        }
                    });
                });
            }

            const themeButtons = document.querySelectorAll('[data-theme-option]');
            const themeLabels = document.querySelectorAll('[data-theme-label]');
            const themeDropdownStates = [];

            const closeDropdown = (state, { focusToggle = false } = {}) => {
                if (!state) return;

                state.dropdown.classList.remove('is-open');
                state.panel.classList.add('hidden');
                state.panel.setAttribute('aria-hidden', 'true');
                state.toggle.setAttribute('aria-expanded', 'false');

                if (focusToggle) {
                    state.toggle.focus();
                }
            };

            const openDropdown = (state) => {
                if (!state) return;

                state.dropdown.classList.add('is-open');
                state.panel.classList.remove('hidden');
                state.panel.setAttribute('aria-hidden', 'false');
                state.toggle.setAttribute('aria-expanded', 'true');
            };

            document.querySelectorAll('[data-theme-dropdown]').forEach((dropdown) => {
                const toggle = dropdown.querySelector('[data-theme-toggle]');
                const panel = dropdown.querySelector('[data-theme-panel]');

                if (!toggle || !panel) {
                    return;
                }

                panel.classList.add('hidden');
                panel.setAttribute('aria-hidden', 'true');
                toggle.setAttribute('aria-expanded', 'false');

                const state = { dropdown, toggle, panel };

                toggle.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const isOpen = dropdown.classList.contains('is-open');

                    themeDropdownStates.forEach((otherState) => {
                        if (otherState !== state) {
                            closeDropdown(otherState);
                        }
                    });

                    if (isOpen) {
                        closeDropdown(state);
                    } else {
                        openDropdown(state);
                    }
                });

                dropdown.addEventListener('keydown', (event) => {
                    if (event.key === 'Escape' && dropdown.classList.contains('is-open')) {
                        event.preventDefault();
                        closeDropdown(state, { focusToggle: true });
                    }
                });

                panel.addEventListener('click', (event) => {
                    event.stopPropagation();
                });

                themeDropdownStates.push(state);
            });

            document.addEventListener('click', (event) => {
                themeDropdownStates.forEach((state) => {
                    if (state.dropdown.classList.contains('is-open') && !state.dropdown.contains(event.target)) {
                        closeDropdown(state);
                    }
                });
            });

            const themes = {
                ocean: { label: 'Ocean' },
                sunset: { label: 'Sunset' },
                forest: { label: 'Forest' },
                royal: { label: 'Royal' },
                aurora: { label: 'Aurora' },
                berry: { label: 'Berry' }
            };

            const defaultTheme = 'ocean';

            const applyTheme = (themeName, { persist = true } = {}) => {
                if (!themes[themeName]) {
                    themeName = defaultTheme;
                }

                document.body.setAttribute('data-theme', themeName);

                if (persist) {
                    try {
                        localStorage.setItem('preferred-theme', themeName);
                    } catch (error) {
                        console.warn('Tidak dapat menyimpan preferensi tema', error);
                    }
                }

                themeButtons.forEach((button) => {
                    const isActive = button.dataset.themeOption === themeName;
                    button.setAttribute('aria-pressed', String(isActive));
                    button.classList.toggle('is-active', isActive);
                });

                themeLabels.forEach((labelElement) => {
                    labelElement.textContent = themes[themeName].label;
                });
            };

            let storedTheme = null;
            try {
                storedTheme = localStorage.getItem('preferred-theme');
            } catch (error) {
                console.warn('Tidak dapat membaca preferensi tema', error);
            }

            const initialTheme = themes[storedTheme] ? storedTheme : document.body.getAttribute('data-theme') || defaultTheme;
            applyTheme(initialTheme, { persist: false });

            themeButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    applyTheme(button.dataset.themeOption);

                    themeDropdownStates.forEach((state) => {
                        if (state.panel.contains(button)) {
                            closeDropdown(state);
                        }
                    });
                });
            });
        });

