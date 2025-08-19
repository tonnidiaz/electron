import { FlatTreeItem } from "@tufiletree/utils/types";

export const METHODS = ["GET", "POST", "OPTIONS", "DELETE"] as const;
export const typeMap = {
    string: "text",
    number: "number",
    boolean: "checkbox",
    bigint: "number",
    symbol: "text",
    undefined: "text",
    object: "file",
    function: "hidden"
  };

  export const testTreeItems = [
    {
        label: 'app', children: [
            { label: 'home.tsx' },
            { label: 'about.tsx' },
            { label: 'contact.tsx' },
        ]
    },

    { label: 'index.ts' },
    { label: 'package.json.ts' },
    { label: 'java.c' },
    
    {
        label: 'romponents', children: [
            { label: 'comp-home.tsx' },
            { label: 'comp-about.tsx' },
            { label: 'comp-contact.tsx' },
        ]
    },
];

export const flatList: FlatTreeItem[] = [
    // Roots
    { id: "1", parentId: null, label: "Workspace", type: "folder" },
    { id: "2", parentId: null, label: "Shared", type: "folder" },

    // Workspace subtree
    { id: "3", parentId: "1", label: "Design", type: "folder" },
    { id: "4", parentId: "3", label: "Wireframes", type: "folder" },
    { id: "5", parentId: "4", label: "Homepage.sketch", type: "file" },
    { id: "6", parentId: "4", label: "LoginFlow.sketch", type: "file" },
    { id: "7", parentId: "3", label: "Assets", type: "folder" },
    { id: "8", parentId: "7", label: "logo.svg", type: "file" },
    { id: "9", parentId: "7", label: "banner.png", type: "file" },
    { id: "10", parentId: "1", label: "Docs", type: "folder" },
    { id: "11", parentId: "10", label: "Specifications.docx", type: "file" },
    { id: "12", parentId: "10", label: "Roadmap.md", type: "file" },

    // Deeper branch within Shared
    { id: "13", parentId: "2", label: "TeamPhotos", type: "folder" },
    { id: "14", parentId: "13", label: "Alice.jpg", type: "file" },
    { id: "15", parentId: "13", label: "Bob.jpg", type: "file" },
    { id: "16", parentId: "2", label: "Templates", type: "folder" },
    { id: "17", parentId: "16", label: "Proposal.docx", type: "file" },
    { id: "18", parentId: "16", label: "Report.docx", type: "file" },
    { id: "19", parentId: "16", label: "SubTemplates", type: "folder" },
    { id: "20", parentId: "19", label: "InvoiceTemplate.xlsx", type: "file" },
    { id: "21", parentId: "19", label: "PresentationTemplate.pptx", type: "file" },

    // Cross-link deeper nested levels
    { id: "22", parentId: "7", label: "Favicon.ico", type: "file" },
    { id: "23", parentId: "7", label: "banner-small.png", type: "file" },
];