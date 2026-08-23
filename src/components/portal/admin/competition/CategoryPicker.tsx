"use client";

const inputClass =
  "w-full min-h-12 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-3 text-base text-white placeholder:text-neutral-600 focus:border-[#c9b072]/50 focus:outline-none sm:text-sm sm:min-h-0 sm:py-2.5";

type Props = {
  name?: string;
  categories: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  inputClassName?: string;
};

export function CategoryPicker({
  name = "category",
  categories,
  value,
  onChange,
  required,
  placeholder,
  inputClassName = inputClass,
}: Props) {
  const selectedKey = value.trim().toLowerCase();

  return (
    <div className="space-y-2">
      {categories.length > 0 ? (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Existing categories"
        >
          {categories.map((category) => {
            const selected = selectedKey === category.toLowerCase();
            return (
              <button
                key={category}
                type="button"
                onClick={() => onChange(category)}
                aria-pressed={selected}
                className={`min-h-11 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? "border-[#c9b072] bg-[#c9b072] text-black"
                    : "border-neutral-700 bg-neutral-950 text-neutral-200 hover:border-[#c9b072]/50 hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      ) : null}
      <input
        type="text"
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={
          placeholder ??
          (categories.length > 0
            ? "Or type a new category"
            : "e.g. Male")
        }
        className={inputClassName}
        autoComplete="off"
      />
    </div>
  );
}
