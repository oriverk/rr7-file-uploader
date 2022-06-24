import { FC,  } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import { FormData } from "../types/firestore";
import { CreateFormSchema } from "../lib/zod";
import { Container } from "../components/Container";
import { Input, PasswordInput, TextArea, Button } from "../components/Form"
import { DropzoneInput } from "../components/Dropzone"

export const New: FC = () => {
  const methods = useForm<Pick<FormData, 'name' | 'description' | 'password' | 'file'>>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      name: "",
      file: [],
      description: "",
      password: ""
    }
  })
  const { handleSubmit } = methods;
  const onSubmit = handleSubmit(data => {
    alert(JSON.stringify(data, null, 2))
  });

  return (
    <Container>
      <div className="mb-4">
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <div className="mt-8 mx-auto max-w-xl">
              <div className="grid grid-cols-1 gap-6">
                <DropzoneInput
                  id="file"
                  label="file"
                  accept={{
                    'application/zip': ['.zip'],
                  }}
                />
                <Input id="name" label="name" />
                <TextArea id="description" label="description" />
                <PasswordInput id="password" label="password" />
                {/* <CheckBox id="deletedAt" label="delete" /> */}
                <Button type="submit">
                  submit
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  )
}