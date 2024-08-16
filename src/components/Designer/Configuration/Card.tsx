import React from 'react';

interface IInputComponentProps {
  propertyName: string
  schemaProperty: { [key: string]: any };
  onChange: (value: string | number | boolean) => void;
}

function InputComponent({ propertyName, schemaProperty, onChange }: IInputComponentProps) {
  const { type, value, selection, min, max, readonly } = schemaProperty;
  switch (type) {
    case 'string':
      return (
        <input
          type="text"
          className="input input-bordered input-xs flex-1 w-xs bg-transparent rounded-sm ml-2"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readonly}
        />
      );
    case 'string_select':
      return (
        <select
          className="select select-bordered select-xs flex-1 w-xs bg-figmaGrey rounded-sm ml-2"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          disabled={readonly}
        >
          {selection?.map((item: string) => (
            <option
              key={`${propertyName}-${item}`}
              value={item}
              disabled={item === value}
            >
              {item}
            </option>
          ))}
        </select>
      );
    case 'number':
      return (
        <input
          type="number"
          className="input input-bordered input-xs flex-1 w-xs bg-transparent rounded-sm ml-2"
          value={value as number}
          onChange={(e) => {
            const number = parseInt(e.target.value);
            isNaN(number) ? onChange('0') : onChange(number.toString());
          }}
          readOnly={readonly}
        />
      );
    case 'number_range':
      return (
        <div className="ml-2 w-full flex flex-row items-center">
          <input
            type="range"
            className="range range-xs bg-transparent flex-1"
            min={min || 0}
            max={max || 100}
            value={value as number}
            onChange={(e) => onChange(parseInt(e.target.value))}
          />
          <input
            type="number"
            className="input input-bordered input-xs bg-transparent rounded-sm ml-2 w-17"
            value={value as number}
            onChange={(e) => {
              const number = parseInt(e.target.value);
              isNaN(number) ? onChange('0') : onChange(number.toString());
            }}
          />
        </div>
      );
    case 'boolean':
      return (
        <label className="cursor-pointer label ml-2 px-0">
          <span className="label-text text-xs mr-2 text-textWhite">False</span>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-secondary"
            onChange={(e) => onChange(e.target.checked)}
            checked={value as boolean}
            readOnly={readonly}
          />
          <span className="label-text text-xs ml-2 text-textWhite">True</span>
        </label>
      );
    default: {
      return <div> Unkown Input {JSON.stringify(schemaProperty)}</div>;
    }
  }
}

interface ICardProps {
  schemaProperty: { [key: string]: any };
  onChange: (value: string | number | boolean) => void;
}

function ConfigCard({ schemaProperty, onChange }: ICardProps) {
  const { title, description } = schemaProperty;
  return (
    <div className="w-full flex flex-col justify-start items-center border-b border-figmaBorder py-2">
      <div className="w-full flex flex-row justify-start items-center py-2">
        <div className="w-2" />
        <span className="text-xs text-white ml-2">{title}</span>
      </div>
      <div className="w-full flex flex-row justify-start items-center pb-2">
        <div className="w-2" />
        <span className="text-xs text-textGrey ml-2">{description}</span>
      </div>
      <div className="w-full flex flex-row justify-start items-center pb-2">
        <div className="w-2" />
        <InputComponent propertyName={title} schemaProperty={schemaProperty} onChange={onChange} />
        <div className="w-4" />
      </div>
    </div>
  );
}

export default ConfigCard;
