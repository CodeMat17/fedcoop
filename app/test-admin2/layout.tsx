import { useStoreUserEffect } from "@/utils/useStoreUserEffect";

export default function Admin2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useStoreUserEffect();
  return <main>{isLoading ? <div>Loading...</div> : !isAuthenticated ? <p>You are not signed in</p> : <>{children}</>}</main>;
}
