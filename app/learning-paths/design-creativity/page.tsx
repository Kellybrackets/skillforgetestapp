"use client"

import { DynamicPathPage } from '@/components/learning-paths/dynamic-path-page'
import { GenericPathContent } from '@/components/learning-paths/generic-path-content'

export default function DesignCreativityPage() {
  return (
    <DynamicPathPage pathId="design-creativity">
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