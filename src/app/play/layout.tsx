export default function RootLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>){
     return (
          <div className="primary-main-bg flex justify-center items-center flex-col min-h-screen p-3 relative">
               {children}
          </div>
     )
}