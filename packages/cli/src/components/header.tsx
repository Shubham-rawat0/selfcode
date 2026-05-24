function Header() {
  return (
    <box alignItems="center" justifyContent="center">
      <box justifyContent="center" alignItems="center" gap={0.5} flexDirection="row">
       
       <ascii-font font="tiny" text="Self" color="gray"/>
       <ascii-font font="tiny" text="code" />
      </box>
    </box>
  )
}
export default Header