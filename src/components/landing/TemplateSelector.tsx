import { useRef, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';
import { getUniqueTemplates } from './templates';
import { Modal } from '../ui/Modal';
import { Palette, Check } from 'lucide-react';
import type { Template, TemplateVariantGroup } from './templates/types';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
  showAllTemplates: boolean;
  setShowAllTemplates: (show: boolean) => void;
}

// Type guard to check if template is a variant group
function isVariantGroup(template: Template | TemplateVariantGroup): template is TemplateVariantGroup {
  return 'variants' in template && 'baseId' in template;
}

export function TemplateSelector({
  selectedTemplateId,
  onSelect,
  showAllTemplates,
  setShowAllTemplates
}: TemplateSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTemplate = (templateId: string) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const templateElement = container.querySelector(`[data-template-id="${templateId}"]`);
    if (templateElement) {
      templateElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  useEffect(() => {
    if (selectedTemplateId) {
      scrollToTemplate(selectedTemplateId);
    }
  }, [selectedTemplateId]);

  const handleTemplateSelect = (templateId: string) => {
    onSelect(templateId);
    setShowAllTemplates(false);
    scrollToTemplate(templateId);
  };

  const handleVariantSelect = (variantId: string) => {
    onSelect(variantId);
  };

  const uniqueTemplates = getUniqueTemplates();

  const renderTemplateCard = (template: Template | TemplateVariantGroup) => {
    if (isVariantGroup(template)) {
      const currentVariant = template.variants.find((v) => v.id === selectedTemplateId) || template.variants[0];
      const isSelected = selectedTemplateId === currentVariant.id;
      return (
        <Card
          key={template.baseId}
          data-template-id={template.baseId}
          className={cn(
            'cursor-pointer transition-all hover:shadow-lg w-[200px] flex-shrink-0',
            isSelected && 'ring-2 ring-rose-500'
          )}
          onClick={() => handleVariantSelect(currentVariant.id)}
        >
          <div className="aspect-[3/5] max-h-[300px] relative overflow-hidden mx-auto p-1">
            <img
              src={currentVariant.preview}
              alt={currentVariant.name}
              className="object-cover w-full h-full"
            />
          </div>
          <CardContent className="p-4 flex flex-col items-center">
            <h3 className="font-semibold text-gray-900 text-center mb-2">{template.name}</h3>
            {isSelected && (
              <span className="flex items-center justify-center w-7 h-7 rounded-full border shadow bg-white border-rose-500 mb-2">
                <Check className="w-5 h-5 text-rose-600" />
              </span>
            )}
            {/* Color variant selector */}
            <div className="flex gap-2 justify-center mt-2">
              {template.variants.map((variant) => (
                <button
                  type="button"
                  key={variant.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVariantSelect(variant.id);
                  }}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 transition-all',
                    selectedTemplateId === variant.id
                      ? 'border-primary scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                  style={{
                    backgroundColor: variant.colorValue
                  }}
                  title={variant.name}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      );
    } else {
      const isSelected = selectedTemplateId === template.id;
      return (
        <Card
          key={template.id}
          data-template-id={template.id}
          className={cn(
            'cursor-pointer transition-all hover:shadow-lg w-[200px] flex-shrink-0',
            isSelected && 'ring-2 ring-rose-500'
          )}
          onClick={() => onSelect(template.id)}
        >
          <div className="aspect-[3/5] max-h-[300px] relative overflow-hidden mx-auto p-1">
            <img
              src={template.preview}
              alt={template.name}
              className="object-cover w-full h-full"
            />
          </div>
          <CardContent className="p-4 flex flex-col items-center">
            <h3 className="font-semibold text-gray-900 text-center mb-2">{template.name}</h3>
            {isSelected && (
              <span className="flex items-center justify-center w-7 h-7 rounded-full border shadow bg-white border-rose-500 mb-2">
                <Check className="w-5 h-5 text-rose-600" />
              </span>
            )}
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-4 -mx-6 px-6" ref={scrollContainerRef}>
        <div className="flex gap-6 min-w-max py-4">
          {uniqueTemplates.map((template) => renderTemplateCard(template))}
        </div>
      </div>

      <Modal
        isOpen={showAllTemplates}
        onClose={() => setShowAllTemplates(false)}
        title="Todos los diseños"
        panelClassName="w-full max-w-lg sm:max-w-7xl"
      >
        <div className="w-full">
          <div className="grid grid-cols-2 lg:grid-cols-6 p-0 gap-2 md:p-2">
            {uniqueTemplates.map((template) => {
              if (isVariantGroup(template)) {
                const currentVariant = template.variants.find((v) => v.id === selectedTemplateId) || template.variants[0];
                
                return (
                  <Card
                    key={template.baseId}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-lg',
                      selectedTemplateId === currentVariant.id && 'ring-2 ring-rose-500'
                    )}
                    onClick={() => handleTemplateSelect(currentVariant.id)}
                  >
                    <div className="aspect-[3/5] max-h-[200px] relative overflow-hidden rounded-t-lg mx-auto p-2">
                      <img
                        src={currentVariant.preview}
                        alt={currentVariant.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="pb-2 pt-0 flex flex-col items-center">
                      <h3 className="font-medium text-gray-900 text-center mb-2">{template.name}</h3>
                      {selectedTemplateId === currentVariant.id && (
                        <span className="flex items-center justify-center w-7 h-7 rounded-full border shadow bg-white border-rose-500 mb-2">
                          <Check className="w-5 h-5 text-rose-600" />
                        </span>
                      )}
                      <div className="flex gap-2 justify-center mt-2">
                        {template.variants.map((variant) => (
                          <button
                            type="button"
                            key={variant.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVariantSelect(variant.id);
                            }}
                            className={cn(
                              'w-4 h-4 rounded-full border transition-all',
                              selectedTemplateId === variant.id
                                ? 'border-primary scale-110'
                                : 'border-gray-300 hover:border-gray-400'
                            )}
                            style={{
                              backgroundColor: variant.colorValue
                            }}
                            title={variant.name}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              } else {
                return (
                  <Card
                    key={template.id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-lg',
                      selectedTemplateId === template.id && 'ring-2 ring-rose-500'
                    )}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="aspect-[3/5] max-h-[200px] relative overflow-hidden rounded-t-lg mx-auto p-2">
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="pb-2 pt-0 flex flex-col items-center">
                      <h3 className="font-medium text-gray-900 text-center mb-2">{template.name}</h3>
                      {selectedTemplateId === template.id && (
                        <span className="flex items-center justify-center w-7 h-7 rounded-full border shadow bg-white border-rose-500 mb-2">
                          <Check className="w-5 h-5 text-rose-600" />
                        </span>
                      )}
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}