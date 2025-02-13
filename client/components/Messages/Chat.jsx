import { Card, CardBody, Avatar, Image } from "@heroui/react";
import NewUser from "./NewUser";

export default function Chat({ content, own, type, name }) {
  return (
    <Card
      className={`w-fit bg-transparent ${own && "ml-auto bg-blue-200"} ${
        type === "user" && "mx-auto bg-green-50"
      }`}
    >
      <CardBody className="flex flex-row gap-2 items-center">
        {!own && type !== "user" && (
          <Avatar
            isBordered
            color="default"
            src="https://avatar.iran.liara.run/public"
            size="sm"
            name={name}
          />
        )}

        {/* New User */}
        {type === "user" && <NewUser name={content} />}

        {/* Text Message */}
        {type === "text" && <p>{content}</p>}

        {/* Link Message */}
        {type === "link" && (
          <p className="underline">
            <a href={content} target="_blank">
              {content}
            </a>
          </p>
        )}

        {/* Image Message */}
        {type === "image" && (
          <Image alt="image message" src={content} width={400} />
        )}
      </CardBody>
    </Card>
  );
}