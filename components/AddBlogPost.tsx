import React from "react";
import styles from "@/styles/addblogpost.module.css";

const AddBlogPost = () => {
  return (
    <>
      <article
        className={styles.bloginput__box}
        v-if="props.togglePostInput && closeInput"
      >
        <button
          type="button"
          className={styles.btn}
          //   :className="[!inputContent ? ' cursor-not-allowed' : '']"
          //   :disabled="!inputContent"
          //   onClick={handleSubmit}
        >
          Publish
        </button>
        <svg
          className={`${styles.svg} ${styles.closeInput}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          v-if="props.togglePostInput && closeInput"
          v-show="closeInput"
          //   onClick={handlePostInput}
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
        <div className={styles.inner__container}>
          <div className={styles.icons__box}>
            <svg
              className={styles.svg}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              v-if="!upload"
              //   onClick={handleFileUpload}
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
            <svg
              className={styles.svg}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              v-if="upload || uploadImage"
              //   onClick={handleFileUpload}
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </div>
          <div className={styles.box} v-if="upload">
            <svg
              className={styles.svg}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              //   onClick={fileInput?.click()}
              v-if="!uploadImage"
            >
              <path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
            </svg>
            <input
              type="file"
              className={styles.hidden}
              //   ref="fileInput"
              //   @change="handleFileChange"
            />

            <svg
              className={styles.svg}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              //   onClick="fileInput?.click()"
              v-if="!uploadImage"
            >
              <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
            </svg>
            <input
              type="file"
              className={styles.hidden}
              //   ref="fileInput"
              //   @change="handleFileChange"
            />
          </div>
          <div className={styles.imgbox} v-if="!upload">
            {/* <img :src="photoImage" alt=".." /> */}
          </div>

          <div className={styles.inputbox} v-if="!upload">
            <input type="text" placeholder="Title" className="blog__title" />
            <input
              type="text"
              placeholder="click here to write..."
              className={styles.blog__post}
              //   onClick={handleInputcontent}
            />
          </div>
          <input
            v-if="photoImage"
            type="text"
            placeholder="Title"
            v-model="post.postTitle"
            className={styles.otherblog__posttitle}
          />
          <input
            v-if="photoImage"
            // style="width: 100%;, font-size: 1.2rem;"
            type="text"
            placeholder="click here to write..."
            className={styles.otherblog__post}
            // onClick="handleInputcontent"
          />
        </div>

        {/* <div className="blog__content" v-if="inputContent">
      <VMarkdownEditor
       
        v-model="post.content"
        locale="en"
        // :upload-action="handleUpload"
        className="markdown"
      />
    </div> */}
      </article>
    </>
  );
};

export default AddBlogPost;
