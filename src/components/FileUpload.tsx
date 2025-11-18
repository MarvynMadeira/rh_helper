"use client";

import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  currentUrl?: string;
  accept?: string;
  label?: string;
}

export function FileUpload({
  onFileSelect,
  currentUrl,
  accept = "*/*",
  label = "Enviar arquivo",
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Arquivo Atual */}
      {currentUrl && !selectedFile && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200">
          <FileText size={18} className="text-gray-400" />
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline flex-1"
          >
            Ver arquivo atual
          </a>
        </div>
      )}

      {/* Arquivo Selecionado */}
      {selectedFile ? (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded border border-blue-200">
          <FileText size={18} className="text-blue-600" />
          <span className="text-sm text-gray-700 flex-1">
            {selectedFile.name}
          </span>
          <button
            type="button"
            onClick={clearFile}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
            <Upload size={20} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              Clique para {currentUrl ? "substituir" : "enviar"} arquivo
            </span>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Formatos aceitos: PDF, imagens, documentos (máx. 10MB)
      </p>
    </div>
  );
}
