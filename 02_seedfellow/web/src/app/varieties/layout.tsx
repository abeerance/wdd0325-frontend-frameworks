export default function VarietiesLayout({
  children,
}: LayoutProps<"/varieties">) {
  return (
    <div className="flex flex-col gap-6">
      <p className="font-medium text-moss text-sm uppercase tracking-widest">
        From the library
      </p>
      {children}
    </div>
  );
}
