interface UserInterface {
  name: string;
  email: string;
  password: string;
  avatar: string;
  setPassword(password: string, salt: string): void;
  getPassword(): string;
  verifyPassword(password: string, salt: string): boolean;
}

export default UserInterface;
