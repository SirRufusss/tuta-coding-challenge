export const mockData: { [key: string]: { exists: boolean, type: string | null } } = {
    "https://example.com/file": { exists: true, type: 'eine file (Deutsch: Datei)' },
    "https://example.com/folder": { exists: true, type: 'einen folder (Deutsch: Ordner)' },
    "https://example.com": { exists: true, type: null },
    "https://NICHT-GUELTIGE-URL.com": { exists: false, type: null }
};

