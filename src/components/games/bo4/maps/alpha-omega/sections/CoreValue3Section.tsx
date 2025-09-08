import { useState } from "react";
import { NumberPad } from "@/components/content";
import { BaseSection } from "@/components/core";
import type { BaseSectionProps } from "@/components/core/BaseSection";

// Data interface for this section  
interface CoreValue3Data {
  code1: string;
  code2: string;
  code3: string;
}

function CoreValue3Section(props: BaseSectionProps<CoreValue3Data>) {
  const [inputMethod, setInputMethod] = useState<"keypad" | "text">("keypad");

  return (
    <BaseSection
      config={{
        storageKey: "alpha-omega-core-value-3-data",
        defaultValue: { 
          code1: "",
          code2: "",
          code3: ""
        },
        title: "Core Value 3",
        description: "Use Brain Rot AAT to turn zombies in front of paintings and reveal the hidden codes.",
        resetButtonText: "Reset Core Value 3",
        tipsConfig: {
          show: true,
          items: [
            {
              label: "Brain Rot Setup",
              text: "Get the Brain Rot AAT (Alternate Ammo Type) on your weapon first"
            },
            {
              label: "Beds Painting",
              text: "Turn a zombie in front of the painting to the left of the teleporter in Beds"
            },
            {
              label: "Green House Painting", 
              text: "Turn a zombie in front of the painting at the top of the stairs in Green House"
            },
            {
              label: "Lounge Painting",
              text: "Turn a zombie in front of the painting next to the exit tunnel in Lounge"
            },
            {
              label: "Rushmore Entry",
              text: "Enter the 3 codes into Rushmore in any order to complete this step"
            }
          ]
        },
        settingsConfig: {
          show: true,
          title: "Input Preferences",
          description: "Customize how you input the painting codes.",
          settings: [
            {
              id: "input-method",
              label: "Code Entry",
              value: inputMethod,
              options: [
                { value: "keypad", label: "Number Keypad" },
                { value: "text", label: "Text Input" }
              ],
              note: "Choose your preferred method for entering 4-digit codes",
              onChange: (value) => setInputMethod(value as "keypad" | "text")
            }
          ]
        }
      }}
      getProgress={(data: CoreValue3Data) => {
        const codes = [data.code1, data.code2, data.code3];
        const completedCodes = codes.filter(code => code && code.length === 4).length;
        
        return {
          completed: completedCodes,
          total: 3,
          isComplete: completedCodes === 3
        };
      }}
      {...props}
    >
      {({ data, setData }) => {
        const handleCodeChange = (location: keyof CoreValue3Data, value: string) => {
          setData(prevData => ({
            ...prevData,
            [location]: value
          }));
        };

        const completedCodes = [
          { label: "Code 1", code: data.code1 },
          { label: "Code 2", code: data.code2 },
          { label: "Code 3", code: data.code3 }
        ].filter(item => item.code && item.code.length === 4);

        return (
          <div className="core-value-3-section-content">
            
            {/* Code Entry Section */}
            <div className="codes-input-section">
              <h3>Painting Codes</h3>
              <div className="codes-grid">
                <NumberPad
                  value={data.code1 || ""}
                  onChange={(value) => handleCodeChange("code1", value)}
                  title="Code 1"
                  maxLength={4}
                  includeZero={true}
                  inputMode={inputMethod}
                  className="painting-code-numberpad"
                />

                <NumberPad
                  value={data.code2 || ""}
                  onChange={(value) => handleCodeChange("code2", value)}
                  title="Code 2"
                  maxLength={4}
                  includeZero={true}
                  inputMode={inputMethod}
                  className="painting-code-numberpad"
                />

                <NumberPad
                  value={data.code3 || ""}
                  onChange={(value) => handleCodeChange("code3", value)}
                  title="Code 3"
                  maxLength={4}
                  includeZero={true}
                  inputMode={inputMethod}
                  className="painting-code-numberpad"
                />
              </div>
            </div>

            {/* Results Section */}
            {completedCodes.length > 0 && (
              <div className="codes-results-section">
                <h3>Rushmore Code Sequence</h3>
                <p>Enter these codes into Rushmore in any order:</p>
                <div className="results-grid">
                  {completedCodes.map((item) => (
                    <div key={item.label} className="result-item complete">
                      <div className="result-number">{item.code}</div>
                      <div className="result-label">{item.label}</div>
                    </div>
                  ))}
                  
                  {/* Show remaining slots */}
                  {Array.from({ length: 3 - completedCodes.length }, (_, index) => (
                    <div key={`empty-${index}`} className="result-item incomplete">
                      <div className="result-number">----</div>
                      <div className="result-label">Pending</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        );
      }}
    </BaseSection>
  );
}

export default CoreValue3Section;