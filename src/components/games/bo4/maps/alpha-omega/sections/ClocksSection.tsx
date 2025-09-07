import React from "react";
import { FloatingCard } from "@/components/content";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Data interface for this section
interface ClocksData {
  placeholder: boolean;
}

function ClocksSection(props: BaseSectionProps<ClocksData>) {
  return (
    <BaseSection
      config={{
        storageKey: "alpha-omega-clocks-data",
        defaultValue: { placeholder: false },
        title: "Clocks",
        description: "This section is coming soon.",
        resetButtonText: "Reset Clocks"
      }}
      getProgress={(data: ClocksData) => ({
        completed: 0,
        total: 1,
        isComplete: false
      })}
      {...props}
    >
      {({ data, setData, progress }) => (
        <div className="clocks-section-content">
          <FloatingCard>
            <h4>Coming Soon</h4>
            <p>The Clocks section will be implemented next. This will contain the clock-related puzzles for Alpha Omega.</p>
          </FloatingCard>
        </div>
      )}
    </BaseSection>
  );
}

export default ClocksSection;