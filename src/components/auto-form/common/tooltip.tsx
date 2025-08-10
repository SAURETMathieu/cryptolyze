function AutoFormTooltip({ fieldConfigItem }: { fieldConfigItem: any }) {
  return (
    <>
      {fieldConfigItem?.description && (
        <div className="text-muted-foreground text-sm">
          {fieldConfigItem.description}
        </div>
      )}
    </>
  );
}

export default AutoFormTooltip;
