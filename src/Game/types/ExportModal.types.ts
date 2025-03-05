export interface ExportModalProps {
  showExportModal: boolean;
  exportedCode: string;
  onClose: () => void;
  onCopy: () => void;
}
