"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageResultsProps {
  results: {
    data: Array<{
      image: string
      list: Array<
        Array<{
          confidence: number
          is_match: boolean
          text: string
        }>
      >
    }>
    excel_download_link: string
    title_results: Array<
      Array<{
        confidence: number
        coordinates: number[]
        ocr_text: string
      }>
    >
  }
}

export function ImageResults({ results }: ImageResultsProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (index: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Processing Results</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`http://172.29.97.78:5000${results.excel_download_link}`, "_blank")}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Excel
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="data">
          <TabsList className="mb-4">
            <TabsTrigger value="data">Extracted Data</TabsTrigger>
            <TabsTrigger value="titles">Title Detection</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-6">
            {results.data.map((item, imageIndex) => (
              <Card key={imageIndex} className="overflow-hidden">
                <CardHeader className="bg-gray-50 p-4">
                  <CardTitle className="text-base">Image {imageIndex + 1}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Processed Image</h3>
                      <div className="border rounded-md overflow-hidden">
                        <img
                          src={`http://172.29.97.78:5000${item.image}`}
                          alt={`Processed image ${imageIndex + 1}`}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Extracted Text</h3>
                      {item.list.length > 0 ? (
                        <div className="border rounded-md p-3 max-h-[400px] overflow-y-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  ID
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Score
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Confidence
                                </th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {item.list.map((row, rowIndex) => (
                                <tr
                                  key={rowIndex}
                                  className={!row[0]?.is_match || !row[1]?.is_match ? "bg-red-50" : ""}
                                >
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">{row[0]?.text}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">{row[1]?.text}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                    {row[0] && row[1]
                                      ? `${(row[0].confidence * 100).toFixed(1)}% / ${(row[1].confidence * 100).toFixed(1)}%`
                                      : "N/A"}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    {row[0]?.is_match && row[1]?.is_match ? (
                                      <span className="text-green-600">✓</span>
                                    ) : (
                                      <span className="text-red-600">✗</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="border rounded-md p-4 text-center text-gray-500">
                          No data extracted from this image
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="titles">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Detected Titles</h3>
                  {results.title_results.some((group) => group.length > 0) ? (
                    <div className="space-y-6">
                      {results.title_results.map(
                        (group, groupIndex) =>
                          group.length > 0 && (
                            <div key={groupIndex} className="border rounded-md overflow-hidden">
                              <div className="bg-gray-50 px-4 py-2 text-sm font-medium">Image {groupIndex + 1}</div>
                              <div className="p-4">
                                <ul className="space-y-3">
                                  {group.map((item, itemIndex) => (
                                    <li key={itemIndex} className="border-b pb-2">
                                      <div className="text-sm font-medium">{item.ocr_text}</div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        Confidence: {(item.confidence * 100).toFixed(2)}% | Coordinates: [
                                        {item.coordinates.join(", ")}]
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ),
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No title detection results available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

