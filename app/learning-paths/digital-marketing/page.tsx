"use client"

import { DynamicPathPage } from '@/components/learning-paths/dynamic-path-page'
import { GenericPathContent } from '@/components/learning-paths/generic-path-content'

export default function DigitalMarketingPage() {
  return (
    <DynamicPathPage pathId="digital-marketing">
      {({ config, data, stats }) => (
        <GenericPathContent 
          config={config}
          courses={data.courses}
          interviews={data.interviewRoles}
          projects={data.projectBriefs}
          stats={stats}
        />
      )}
    </DynamicPathPage>
  )
}