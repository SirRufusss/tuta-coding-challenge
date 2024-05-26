export const mockData: { [key: string]: { exists: boolean, type: string | null } } = {
    "https://example.com/file": { exists: true, type: 'file' },
    "https://example.com/folder": { exists: true, type: 'folder' },
    "https://example.com": { exists: true, type: null }
};