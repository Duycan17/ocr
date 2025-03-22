import { OcrProcessor } from "@/components/ocr-processor"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">OCR Image Processing Tool</h1>
          <p className="mt-3 text-xl text-gray-500">Upload images to extract and organize text content</p>
        </div>

        <OcrProcessor />
      </div>
    </main>
  )
}

