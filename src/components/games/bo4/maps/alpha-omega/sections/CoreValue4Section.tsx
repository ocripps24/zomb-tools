import React from "react";
import { FloatingCard } from "@/components/content";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Data interface for this section
interface CoreValue4Data {
  placeholder: boolean;
}

function CoreValue4Section(props: BaseSectionProps<CoreValue4Data>) {
  return (
    <BaseSection
      config={{
        storageKey: "alpha-omega-core-value-4-data",
        defaultValue: { placeholder: false },
        title: "Core Value 4", 
        description: "Switches - This section is coming soon.",
        resetButtonText: "Reset Core Value 4"
      }}
      getProgress={(data: CoreValue4Data) => ({
        completed: 0,
        total: 1,
        isComplete: false
      })}
      {...props}
    >
      {({ data, setData, progress }) => (
        <div className="core-value-4-section-content">
          <FloatingCard>
            <h4>Core Value 4: Switches</h4>
            <p>This section will contain the Core Value 4 tasks including switch-related puzzles.</p>
            <p><em>Coming soon...</em></p>
          </FloatingCard>
        </div>
      )}
    </BaseSection>
  );
}

export default CoreValue4Section;