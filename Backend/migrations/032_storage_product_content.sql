BEGIN;

UPDATE products
SET name = 'Low Height Modular Storage Cabinet',
    slug = 'low-height-modular-storage-cabinet',
    short_description = 'A compact low-height cabinet for everyday office files and supplies.',
    description = 'Keep frequently used files and office essentials close at hand with this low-height modular storage cabinet. Its compact profile fits neatly beside a workstation or beneath a window, while the enclosed cupboard space helps keep the office looking organized.',
    catalog_rating = 4.8,
    updated_at = NOW()
WHERE id = 728;

UPDATE products
SET name = 'Full Height Office Storage Cabinet',
    slug = 'full-height-office-storage-cabinet',
    short_description = 'Tall enclosed storage for files, folders and office supplies.',
    description = 'Make better use of vertical space with this full-height office storage cabinet. The tall cupboard design provides generous room for box files, folders and supplies, with doors that keep stored items neatly concealed in a shared office or records area.',
    catalog_rating = 4.8,
    updated_at = NOW()
WHERE id = 729;

UPDATE products
SET name = 'Mobile Side Runner Pedestal',
    slug = 'mobile-side-runner-pedestal',
    short_description = 'A mobile three-drawer pedestal for desk-side storage.',
    description = 'Keep work essentials organized and within reach with this mobile side runner pedestal. Its three-drawer layout offers convenient space for documents and desk accessories, while the compact wheeled design can move easily beside a workstation.',
    catalog_rating = 4.8,
    updated_at = NOW()
WHERE id = 730;

COMMIT;
